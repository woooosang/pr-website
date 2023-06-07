+++
title = "Dependency Injection in Go Microservices"
author = ["Woosang Kang"]
tags = ["dev", "go"]
categories = ["TIL"]
draft = true
+++

## Breaking the Code Coupling {#breaking-the-code-coupling}

Prior to adopting the Dependency Injection pattern, "unit testing" the codebase was virtually impossible, mainly due to its external dependencies (e.g. Firebase Cloud Messaging client), which had to be initialized solely to test a small snippet of newly written code.


## Enforcing The Repository Pattern {#enforcing-the-repository-pattern}

Although the previous codebase vaguely followed the idea of the Repository Pattern, it failed to

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
		hallRepository repositories.HallRepository
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


## References {#references}

-   [The Repository Pattern](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design#the-repository-pattern)
-   [Google Wire Guide](https://github.com/google/wire/blob/main/docs/guide.md)
