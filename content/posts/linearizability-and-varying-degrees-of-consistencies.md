+++
title = "Understanding Different Consistency Guarantees :systems:@TIL"
author = ["Woosang Kang"]
draft = true
+++

On implementing a distributed system, there are a whole variety of consistency models to choose from. Going through papers on system implementations of varying degrees of consistency guarantees (e.g.[Spanner](http://www.cs.cornell.edu/courses/cs5414/2017fa/papers/Spanner.pdf) or [Bayou](http://www.cs.utexas.edu/~lorenzo/corsi/cs380d/papers/p172-terry.pdf)), I found myself using strictly different terms and models interchangeably. To prevent further confusion, I thought it would be a good idea to cover some key terminologies here.


## What _is_ Consistency? {#what-is-consistency}

In a distributed systems perspective, ****consistency**** is a test on the execution of operations[^fn:1] (here, let's limit the type of operations to `read()` and `write(v)` for the sake of simplicity): if the test for a consistency condition \\(C\\) passes on execution \\(e\\), we say \\(e\\) is $C$-consistent.

We can also define hierarchies between different consistency semantics: \\(C\_s\\) is _stronger_ than \\(C\_w\\) iff the set of executions accepted by \\(C\_s\\) is a subset of the set of executions accepted by \\(C\_w\\). (\\(E\_{C\_s}\subset E\_{C\_w}\\)) If neither of them is stronger, than the two are incomparable.


## Causal Consistency {#causal-consistency}

Using Lamport's _happens-before_ relation, we can define a consistency semantic. From the [CAC](https://www.cs.cornell.edu/lorenzo/papers/cac-tr.pdf) paper, an execution is _causally consistent_ if \\(\exists\\) a DAG \\(G\\), a happens-before graph defined by the _precedes_ partial ordering (\\(\succ\_G\\)), satisfies the following check:

-   Serial ordering at each node: If \\(v\\) and \\(v^{\prime}\\) are vertices corresponding to operations by the same node, \\(v.startTime < v^{\prime}.startTime \Leftrightarrow v\prec\_G v^{\prime}\\).
-   Read returns the latest preceding concurrent writes

The important point is that


## Sequential Consistency {#sequential-consistency}


## Further Readings {#further-readings}

-   [Consistency Models (Jepsen)](https://jepsen.io/consistency)
-   [Linearizability: A Correctness Condition for Concurrent Objects (Herilhy)](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi2mqernbX-AhXQMlkFHSzDAQoQFnoECAwQAQ&url=https%3A%2F%2Fcs.brown.edu%2F~mph%2FHerlihyW90%2Fp463-herlihy.pdf&usg=AOvVaw2I8TvobQuAizpu3MojvSZO)
-

[^fn:1]: Adopted from [Consistency, Availability and Convergence (Marajan et al.)](https://www.cs.cornell.edu/lorenzo/papers/cac-tr.pdf)