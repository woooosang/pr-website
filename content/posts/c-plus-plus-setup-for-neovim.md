+++
title = "C++ Setup for Neovim"
author = ["Woosang Kang"]
date = 2023-06-12T01:43:00-04:00
tags = ["dev", "vim"]
categories = ["TIL"]
draft = false
+++

There are a plethora of different ways to setup a C++ development environment in Neovim. Here's one possible way that I landed on after a number of (unsuccessful) attempts on Linux, integrated as a part of my [dotfiles](https://github.com/paul-kang-1/dotfiles).


## Mason and Lsp-Zero (optional) {#mason-and-lsp-zero--optional}

[mason.nvim](https://github.com/williamboman/mason.nvim) is a package manager for Neovim that enables the installation of different utilities (mainly LSP/DAP servers and linter/formatters).

[lsp-zero.nvim](https://github.com/VonHeikemen/lsp-zero.nvim) provides a sweet spot between an out-of-the-box experience and configurability for setting up language-specific functionalities. The barebones plugin configuration with support for Mason for [packer.nvim](https://github.com/wbthomason/packer.nvim)
is as below ([source](https://github.com/VonHeikemen/lsp-zero.nvim#quickstart-for-the-impatient)):

```lua
use {
    'VonHeikemen/lsp-zero.nvim',
    branch = 'v2.x',
    requires = {
        -- LSP Support
        { 'neovim/nvim-lspconfig' }, -- Required
        {
            -- Optional
            'williamboman/mason.nvim',
            run = function()
                pcall(vim.cmd, 'MasonUpdate')
            end,
        },
        { 'williamboman/mason-lspconfig.nvim' }, -- Optional

        -- Autocompletion
        { 'hrsh7th/nvim-cmp' }, -- Required
        { 'hrsh7th/cmp-nvim-lsp' }, -- Required
        { 'hrsh7th/cmp-buffer' }, -- Optional
        { 'hrsh7th/cmp-path' }, -- Optional
        { 'saadparwaiz1/cmp_luasnip' }, -- Optional
        { 'hrsh7th/cmp-nvim-lua' }, -- Optional

        -- Snippets
        { 'L3MON4D3/LuaSnip' },    -- Required
        { 'rafamadriz/friendly-snippets' }, -- Optional
    }
}
```


## Adding `.clangd` and `.clang-format` {#adding-dot-clangd-and-dot-clang-format}

After the prerequisites are installed, there still won't be any visible changes; you have to provide the Clang compiler, which `clangd` is based on, with explicit guidance on compilation. The flags are (obviously) version/platform specific, so double check the system settings!

```shell
CompileFlags:
  Add: [-std=c++20, -Wall, -I/usr/include/c++/11, -I/usr/include/x86_64-linux-gnu/c++/11]
```

Now that the errors are gone, it's time to fine tune the formatter, `clang-format`. This can simply be done by adding a `.clang-format` file with different [options](https://clang.llvm.org/docs/ClangFormatStyleOptions.html) at the root directory of the project. And that's it!
