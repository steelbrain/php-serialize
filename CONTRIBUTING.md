Contributor's Guide
===================

:tada::tada: Thanks for taking the time to contribute :tada::tada:

The following are a set of guidelines for contributing to this project. These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

### UCompiler

If this project has a `.ucompiler` at it's root, then it uses [`UCompiler`](https://github.com/steelbrain/ucompiler) as it's compiler.
UCompiler *requires at least Node v5.0* to work. For your ease of development, `watch` and `compile` scripts are provide in manifest.

#### To compile

```sh
ucompiler go
# or
npm run compile
```


#### To watch

```sh
ucompiler watch
# or
npm run watch
```

### Specs and Tests

This project uses [`Atom`](https://atom.io) as the base for it's Tests. Please have a look at [`Writing Specs` in Atom Flight Manual](http://flight-manual.atom.io/hacking-atom/sections/writing-specs/) to get an understanding of the basics.

Atom Spec runner uses [Jasmine `1.3.x`](http://jasmine.github.io/1.3/introduction.html), please read their docs about it's APIs.

### Linting

This project uses [`ESLint`](http://eslint.org/) as it's linter. To execute the linter, use the `lint` npm script.

```sh
npm run lint
```
