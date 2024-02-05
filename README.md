# DocHub-linter

Linter for DocHub

## Installation

### Via npm
```bash
$ npm install -g dochub-lint
```

## How does it work?
1) Run command in current DocHub architecture project: ``dochub-lint``
2) In case lint file hasn't been found, then linter will create one with the following structure:
```
   {
   "entries": {
   "manifest": "some/path/root.yaml",
   "meta": "some/meta_path/root.yaml",
   "doc": "some/doc_path/root.yaml"
   },
   "rules": {
   "dochub": 2
     }
   }
```
3) edit the file by specifying ``manifest``, ``meta`` and ``doc`` root yaml files. All optional, except ``manifest``.
4) Then specify rules according to your needs. Rule has the following levels: 0 - ignore, 1 - warning, 2 - error.
5) In case errors have been found, then linter will terminate with code 1, otherwise (if all is right, or only warnings are present) with code 0