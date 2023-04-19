+++
title = "Testing Repository Pattern Softwares in Go (1/2)"
author = ["Woosang Kang"]
date = 2023-01-02T15:36:00+09:00
tags = ["dev", "go", "testing"]
categories = ["TIL"]
draft = false
+++

It is fairly easy to perform unit tests in the context of a Repository pattern-based software: simply create mock dependencies with predefined behavior, and initialize the target service with them to check the code logic in a vacuum.
