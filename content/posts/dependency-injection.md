+++
title = "Dependency Injection in Go Microservices"
author = ["Woosang Kang"]
date = 2023-01-02T12:31:00+09:00
tags = ["dev", "go"]
categories = ["TIL"]
draft = false
+++

## Breaking the Code Coupling {#breaking-the-code-coupling}

Prior to adopting the Dependency Injection pattern, "unit testing" the codebase was virtually impossible, mainly due to its external dependencies (e.g. Firebase Cloud Messaging client). Since all the dependencies were tightly coupled _within_ the function that made use of it, it was necessary to initialize all the third-party dependencies in order to test a small snippet of code that I wrote.


## Enforcing The Repository Pattern {#enforcing-the-repository-pattern}

```go
type (
	HallService interface {
		CreateHallWithTx(
			ctx context.Context, sqlTx boil.ContextExecutor, option repositories.HallOption
		) (*models.Hall, error)
		GetHallWithTxOf(
			ctx context.Context, sqlTx boil.ContextExecutor, userID int
		) (*models.Hall, error)
	}

	HallServiceInstance struct {
		hallRepository repositories.HallRepsoitory
	}
)

func NewHallService(h repositories.HallRepository) *HallServiceInstance {
	return &HallServiceInstance{h}
}
```


## Facilitating DI with Wire {#facilitating-di-with-wire}

Although DI improves code readability and eases up the testing procedure, it doesn't exactly scale well as the complexity of the dependency graph increases. Wire provides a number of key advantages compared to manual DI, or other tools like Uber's [dig](https://github.com/uber-go/dig):

-   ****Compile-time injection****: It's always to find any discrepancies in the dependency graph prior to running the actual application.
-   ****Enhanced readability****: In many cases, there will be several _initialization groups_
