+++
title = "Understanding Different Consistency Guarantees"
author = ["Woosang Kang"]
date = 2023-04-24T01:14:00-04:00
tags = ["distributed"]
categories = ["systems"]
draft = false
+++

When it comes to implementing distributed systems, there are a whole variety of consistency models to choose from. Going through papers on system implementations of varying degrees of consistency guarantees (e.g.[Spanner](http://www.cs.cornell.edu/courses/cs5414/2017fa/papers/Spanner.pdf) or [Bayou](http://www.cs.utexas.edu/~lorenzo/corsi/cs380d/papers/p172-terry.pdf)), I found myself mixing up strictly different terms and models. To prevent further confusion, I thought it would be a good idea to cover some key terminologies here.


## What _is_ Consistency? {#what-is-consistency}

There are myriads of different consistency guarantees, but what _is_ consistency in the context of distributed systems in the first place? Different definitions may exist, but I found the following the clearest: ****consistency**** is a test on the execution of operations[^fn:1] (WLOG, let's limit the type of operations to `read()` and `write(v)` for the sake of simplicity): if the test for a consistency condition \\(C\\) passes on execution \\(e\\), we say \\(e\\) is $C$-consistent.

We can also define hierarchies between different consistency semantics: \\(C\_s\\) is _stronger_ than \\(C\_w\\) if and only if the set of executions accepted by \\(C\_s\\) is a subset of the set of executions accepted by \\(C\_w\\). (\\(E\_{C\_s}\subset E\_{C\_w}\\)) If neither of them is stronger, than the two are incomparable.


## Causal Consistency {#causal-consistency}

Using Lamport's _happened-before_ relation, we can define a consistency semantic. As the [CAC](https://www.cs.cornell.edu/lorenzo/papers/cac-tr.pdf) paper states, an execution is _causally consistent_ if \\(\exists\\) a DAG \\(G\\), a happens-before graph defined by the _precedes_ partial ordering (\\(\succ\_G\\)), satisfies the following check:

-   Serial ordering at each node: If \\(v\\) and \\(v^{\prime}\\) are vertices corresponding to operations by the same node, \\(v.startTime < v^{\prime}.startTime \Leftrightarrow v\prec\_G v^{\prime}\\).
-   Read returns the latest preceding concurrent writes. Note that this doesn't place any restrictions  on the ordering of each of the concurrent writes.

The second point essentially _separates consistency from conflict resolution_, as in the responsibility of resolving order between the concurrent writes is passed to the individual nodes. So there is ****no guarantee of a total ordering**** in an execution that is causally consistent; as long as the partial ordering defined by a happened-before relation is satisfied, different nodes may observe different permutations of a valid execution.


### Real-time-causal Consistency (RTC) {#real-time-causal-consistency--rtc}

We could also add a real-time requirement to the consistency test regarding the happened-before graph above. An execution \\(e\\) is _RTC consistent_ if the HB graph satisfies this additional property:

-   \\(\forall u, v: u.endTime < v.startTime \Rightarrow v \nprec\_G u\\)


## Sequential Consistency (Lamport) {#sequential-consistency--lamport}

Unlike causal consistency, sequential consistency constrains the execution to be in some _total order_, and the resulting execution should be consistent with the order of operations on each individual nodes.


## Linearizability {#linearizability}


## External Consistency (Gifford) {#external-consistency--gifford}


## Serializability {#serializability}


## Further Readings {#further-readings}

-   [Consistency Models (Jepsen)](https://jepsen.io/consistency)
-   [Linearizability: A Correctness Condition for Concurrent Objects (Herilhy)](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi2mqernbX-AhXQMlkFHSzDAQoQFnoECAwQAQ&url=https%3A%2F%2Fcs.brown.edu%2F~mph%2FHerlihyW90%2Fp463-herlihy.pdf&usg=AOvVaw2I8TvobQuAizpu3MojvSZO)
-   [Consistency, Availability and Convergence (Marajan et al.)](https://www.cs.cornell.edu/lorenzo/papers/cac-tr.pdf)

[^fn:1]: Adopted from [Consistency, Availability and Convergence (Marajan et al.)](https://www.cs.cornell.edu/lorenzo/papers/cac-tr.pdf)