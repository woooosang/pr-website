+++
title = "First Post!"
author = ["Woosang Kang"]
date = 2022-11-12T18:56:00-05:00
tags = ["org", "hugo"]
categories = ["scribbles"]
draft = false
+++

I used to maintain a rather clunky blog, which was a mixture of `Gulp 4` and `Sass`, but finally gathered my willpower to move on to a lightweight platform.

-   Due to all the heavy assets, the blog template itself (devoid of any content) took up about 10MB. Some parts were brought from a obscure source, so I really did not have a clear understanding of what was going on under the hood.
-   Adding a new page was a pain with the absence of an universial template; dealing with all the HTML tags and what not. I wanted a platform where I could easily jot down stuff, not a polished space without any real content.

That was when I ran into [Hugo](https://gohugo.io) paired with [ox-Hugo](https://ox-hugo.scripter.co/), a backend that exports Org-mode docs in Emacs to Hugo-compatible MD files. And after my first take, I can't help but appreciate the convenience!

-   The whole [Blog repo](https://github.com/paul-kang-1/pr-website) stays under 1KB, and I can leverage tools like `Org-capture` to easily create new posts.
-   With the below command and some use of [autosave setup](https://ox-hugo.scripter.co/doc/auto-export-on-saving/), you can introduce hot loading to the local development.
    ```sh
          hugo server --buildDrafts --navigateToChanged
    ```

Anyway, it feels like I've finally found a nice and cozy setup. Let's see where this leads to!
