+++
title = "Different Types of Build Systems"
author = ["Woosang Kang"]
date = 2023-08-17T16:23:00-04:00
tags = ["dev", "bazel"]
categories = ["devops"]
draft = false
+++

> Dongdongi is cute.

Recently, I worked on implementing a build system in Bazel for a complex NodeJS application managed by Yarn. Although it seemed to be fairly simple in the beginning, it quickly spun off into a complex concern. While the superficial reason was due to the peculiar internal structure of the repository (e.g. symlink farms, local file deps, etc.) and the relative lack of support for NodeJS in Bazel, I realized that there was a fundamental issue in the integration - the gap in the objectives of two different build systems.

> Also, [here](https://github.com/paul-kang-1/bazel-webpack-demo)'s my take on a demo e2e (dependency installation to bundling &amp; static file serving) process for a NodeJS/Webpack-configured repository using Bazel as a build tool. Check it out if you're interested!


## Task-Based Build Systems {#task-based-build-systems}

Generally, task-based build tools would be more familiar to most; popular tools like Maven or Gradle would fall into this category. They are focused on the sequence of tasks that they run, which can be arbitrary scripts. Even Yarn could fall into this category: the `scripts` section in `package.json` allows the developer to add arbitray scripts for any task, and it even allows defining `{pre,post}*` steps that would be automatically run before the main task.

While such build tools makes adding a task trivial and grants maximum flexibility to developers, there also are unignorable consequences of it. Since the tool isn't aware of the output each step produces, the intermediate/final build outputs cannot be cached. Also, even if two different tasks does not overlap in its input and output, the tool will not parallelize the two non-overlapping steps (again due to the lack of knowledge of the task's output), which may be a waste of resources. Moreover, due to the very flexibililty of the tasks that can be defined, debugging or testing such steps would be a difficulty in most cases. The quote from the Bazel introduction document sums it up well:

> The problem with such systems is that they actually end up giving too much power to engineers and not enough power to the system.


## Artifact-Based Build Systems {#artifact-based-build-systems}

Unlike most build tools that executes the predefined sequence of tasks (instructions on _how_ to build), artifact-based build tools focus on _what_ to build. While it also has its own build file as in task-based build tools, they are more of a manifest that usually consists of dependencies (`deps`), input (`src~/~data`) and output (`out`). As visible from the existence of an `out` field, it is aware of the output it produces. This allows aggressive caching and parallelizing non-overlapping tasks/tests over each build target. Although such a setup may be a bit overkill for small toy projects or PoCs, it may be a more reassuring option for projects with large scale.


## Build System Sustainability {#build-system-sustainability}

Now, back to the initial problem of Bazel-_ifying_ a NodeJS codebase. I wanted to implement a build system that meets the following requirements:

1.  **Maintainable with minimal effort.** The repository was growing in a quick pace, and having a 1:1 relationship in code changes and build file updates would not be desirable.
2.  **Hermeticiticy.** The builds should not be affected by the local environment it is run in. Previously, we had to build the code step-by-step in serveral different layers in a containerized environment. However, Bazel's sandbox build environment and hash-based dependency manifest enabled this without much effort.
3.  **Aggressive caching.** Previously with Yarn (and Docker), we downloaded the dependencies (`node_modules`) in one layer, and build the code in the other to maximize caching - the deps would stay there unless it gets altered. However, it still had to build the code even in the absence of changes, which took a considerable amount of time. On the other hand, Bazel was smart enough to check the source tree state, and simply finish without doint anything if the state wasn't altered since last build.


### Yarn: Solely as a Package Manager {#yarn-solely-as-a-package-manager}

When I finally implemented a build system with Bazel, it fulfilled the latter two of my three objectives above. However, the happiness did not last long, as developers would define additional tasks in the Yarn `scripts` section. I had to constantly monitor the updates, and write a corresponding rule in Bazel. Moreover, writing rules to match the ad-hoc scripts often required to go against the Bazel philosophy, such as directly modifying the source tree, which led to forfeiting the advantages that Bazel provided (caching, parallelization, etc).

After some thought, I concluded that it probably isn't a good (sustainable) choice to juxtapose a task-based build tool (Yarn) for the dev workflow, and an artifact-based tool (Bazel) for releases. Instead, Bazel would appropriate the functionality of Yarn as a _project manager_, leaving it solely as a package manager. While would require developers to familiarize themselves with Bazel, it would save all the advantages that Bazel grants as an artifact-based build tool and also free the effort of constantly monitoring the build steps in Yarn.


## References {#references}

-   [Why a build system?](https://bazel.build/basics/build-systems)
