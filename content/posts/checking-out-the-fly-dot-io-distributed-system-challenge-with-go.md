+++
title = "Fly.io Distributed System Challenge with Go"
author = ["Woosang Kang"]
tags = ["dev", "go"]
categories = ["systems"]
draft = true
+++

Recently, I ran into an instresting challenge on distributed systems provided by [Fly.io](https://fly.io/dist-sys/). After going through a laborious semester trying to get in touch with my [inner Ninja](https://www.cs.cornell.edu/courses/cs5414/2023sp/) of theory and implementation, I thought that it would be a good chance to check my understanding of the field.


## Part 1, 2: Echo / Unique ID Generation {#part-1-2-echo-unique-id-generation}

This part was really about familiarizing oneself with the [Maelstrom](https://github.com/jepsen-io/maelstrom) testbench, which the challenge utilizes to abstract node-level operations (`send`, sync/async `rpc`, etc.).


### Globally-Unique ID Generation {#globally-unique-id-generation}

There could be a different number of approaches one could take to handle this operation in a distributed setting. One fairly simple way (given that each of the nodes have their own unique ID)


## Part 3: Broadcast {#part-3-broadcast}


### Naive Broadcast {#naive-broadcast}

Here


### Partition Tolerance {#partition-tolerance}


### Efficiency Metrics {#efficiency-metrics}


### Reshaping the Network {#reshaping-the-network}


### Gossip {#gossip}
