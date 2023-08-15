+++
title = "Generics in Go: Type Inference Based on Parameter Constraints"
author = ["Woosang Kang"]
date = 2023-08-15T16:52:00-04:00
tags = ["dev", "go"]
categories = ["code"]
draft = false
+++

In my small project of implementing a [minimal DNS lookup utility in Go](https://github.com/paul-kang-1/dns-go), I was trying to come up with a simplified logic of parsing the query response into a `DNSPacket` struct, which had the following structure:

```go
type DNSPacket struct {
    Header      *DNSHeader
    Questions   *[]DNSQuestion
    Answers     *[]DNSRecord
    Authorities *[]DNSRecord
    Additionals *[]DNSRecord
}

// initialize from Reader
func (dr *DNSQuestion) FromBytes(reader *bytes.Reader) error { //... }
func (dr *DNSRecord) FromBytes(reader *bytes.Reader) error { //... }
```

See how most of the fields are pointers to a slice? Since all instances of `DNS-` type were created by a pointer receiver function, I wanted to create an interface that covered those types, and then define a generic function `parseSlice` that would construct a slice of the given type, given a `*bytes.Reader` to digest data from. That way, I won't have to write duplicate logic for different `DNS` types:

```go
type DNS interface {
	FromBytes(reader *bytes.Reader) error
}

func parseSlice[T DNS](size int, reader *bytes.Reader) ([]T, error) {
	slice := make([]T, size)
	for i := 0; i < size; i++ {
		if err := slice[i].FromBytes(reader) {
            return nil, err
		}
	}
	return nil
}
```


## Naive approaches {#naive-approaches}

Now, would it be possible to create a slice of any `DNS` implementation as in: `parseSlice[DNSRecord](4, reader)`? Not really - passing `DNSRecord` directly as a parameter type, we are saying that it implements the `DNS` interface. However, `DNSRecord` does not have a `FromBytes` method (it's `*DNSRecord` that has it) making it uncompilable.

On the other hand, passing the pointer type instead to the type parameter (`parseSlice[*DNSRecord](4, reader)`) and making the return type to be `[]*DNSRecord` would make the code compile, but lead to a panic in runtime: the local `slice` of type `[]*DNSRecord` is initialized to a series of `nil`, and calling `FromBytes` will cause a `nil` dereference error. So neither solution works.

How can we achieve such duality? The answer lies on _type constraints_.


## Type constraints {#type-constraints}

While method signatures and embedded interface types are common in interface definitions, the proposal adds three new entities inside interfaces:

An **arbitrary type constraint element** allows any types to be present, not only interface types. This makes expressions such as `type Num interface {int}` possible. However, a type parameter cannot be used plainly inside a definition.

**Approximation constraint element** indicate (`~T`) the set of types that has an underlying type of the given type. For example, `type Stringy interface {~string}` includes all type sets including `string` and those that have an internal representation of `string`.

**Union constraint element** allows the union of different type sets (e.g. `int | int8 | int16`)

Note that if any of these elements are present inside an interface definition, it _cannot_ be used as a variable type, but only as a type constraint! For the problem covered here, the first element would be the most relevant.


### Tip: type conversions {#tip-type-conversions}

For two type parameters `From` and `To`, a value of type `From` can be converted to a value of type `To` if the type set of `From` _equals_ the type set of `To`.


## Final solution {#final-solution}

Back to the problem! To reiterate our objective, we want the `parseSlice` function to take `DNSRecord` (or any other `DNS` interface implementations) as an argument but call its pointer method. The way to achieve this duality, as well described in this [proposal](https://go.googlesource.com/proposal/+/refs/heads/master/design/43651-type-parameters.md#constraint-type-inference), is to revise the interface and the type parameters of `parseSlice` to fulfill both requirements using type constraints.

```go
type DNS[P any] interface {
    FromBytes(reader *bytes.Reader) error
    *P // non-interface type constraint
}
```

Let's break down what this means - or the **type set** it represents. There are two requirements here: a) it should have a `FromBytes` method, and b) its type set is limited to the pointer type of the interface's type parameter. So for an instantiated interface of `DNS[DNSRecord]`, its type set is constrained to type `*DNSRecord`. In other words, the pointer type of `P` should have the method `FromBytes`!

Now we can pass in a non-pointer type as a parameter for `parseSlice`, thereby evading the `nil` dereference issue caused by the `slice` variable being initialized as a slice of pointers.

```go
func parseSlice[T any, PT DNS[T]](size int, reader *bytes.Reader) ([]T, error) {
	slice := make([]T, size)
	for i := 0; i < size; i++ {
        // &slice[i] is type *T, which meets the type conversion criteria
		// (equality of type set). This exposes the FromBytes() method
		p := PT(&slice[i])
		if err := p.FromBytes(reader); err != nil {
			return nil, err
		}
	}
	return slice, nil
}
```

Finally, we can create a slice by calling `parseSlice[DNSRecord](4,reader)`! Although there are two types required as a parameter for `parseSlice`, Go is smart enough to infer the type of `PT` from `T` (type inference), so we don't have to pass in `[DNSRecord, *DNSRecord]`.


## References {#references}

-   [Constraint Type Inference Proposal](https://go.googlesource.com/proposal/+/refs/heads/master/design/43651-type-parameters.md#constraint-type-inference)
