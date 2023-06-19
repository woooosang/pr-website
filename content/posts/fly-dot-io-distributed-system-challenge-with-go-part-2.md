+++
title = "Fly.io Distributed System Challenge with Go (Part 2)"
author = ["Woosang Kang"]
tags = ["dev", "go"]
categories = ["systems"]
draft = true
+++

## Efficiency Metrics {#efficiency-metrics}

Maelstrom, the underlying testbench for the challenge, provided a lot of metrics and charts that could be used to analyze the performance of my algorithm. Here are some of the key metrics:

-   **Stable latency** is a measure of time elapsed for a message to be propagated to all nodes (i.e., visible in the output of `read` operation on every nodes). The latency is displayed in percentiles. For example, a `stable-latencies` field with `{0 0, 0.5 100, 0.95 200, 0.99 300, 1 400}` would indicate a median latency of 100ms, and a maximum of 400ms.
-


## Optimization #1: Reshaping the Network {#optimization-1-reshaping-the-network}

Closely reviewing the problem description, I saw that I could ignore the `topology` message and define my own network.


## Optimization #2: Periodic Gossip {#optimization-2-periodic-gossip}

For the last section, the bar for efficiency got even higher, with `message-per-op` less than 20. However, there was a trade-off in latency, as the bar for the median and maximum latency was now one and two seconds, respectively.

```edn
:net {:all {:send-count 9718,
            :recv-count 9715,
            :msg-count 9718,
            :msgs-per-op 5.037843},
    :clients {:send-count 3958, :recv-count 3958, :msg-count 3958},
    :servers {:send-count 5760,
                :recv-count 5757,
                :msg-count 5760,
                :msgs-per-op 2.9860032},
    :valid? true},

:stable-latencies {0 0, 0.5 895, 0.95 1001, 0.99 1099, 1 1129},
```
