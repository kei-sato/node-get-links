a tool for getting absolute urls from a specific html

# getting started

```
$ wget -qO- http://cs224d.stanford.edu/syllabus.html | tee /tmp/html | ./main.js --prefix='http://cs224d.stanford.edu/' | tee /tmp/href
[ 'http://nlp.stanford.edu/',
  'http://cs224d.stanford.edu/index.html',
  'http://cs229.stanford.edu/section/cs229-linalg.pdf',
  'http://cs229.stanford.edu/section/cs229-prob.pdf',
  'http://cs229.stanford.edu/section/cs229-cvxopt.pdf',
  'http://cs231n.github.io/optimization-1/',
  'http://www.jair.org/media/2934/live-2934-4846-jair.pdf',
  'http://cs224d.stanford.edu/lecture_notes/notes1.pdf',
  'http://cs231n.github.io/python-numpy-tutorial/',
  'http://cs224d.stanford.edu/lectures/CS224d-Lecture1.pdf',
```

# example

## download all pdf 

```
mkdir tmp && wget -qO- http://cs224d.stanford.edu/syllabus.html | tee /tmp/html | ./main.js --prefix='http://cs224d.stanford.edu/' | tee /tmp/href  | jq -r .[] | grep .pdf | xargs wget -P tmp/
```
