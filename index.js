const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :body'
	)
);
morgan.token('body', function(req, res) {
	return JSON.stringify(req.body);
});

const moment = require('moment-timezone');
const { response } = require('express');

const PORT = 3001;

let persons = [
	{
		name   : 'Arto Hellas',
		number : '040-123456',
		id     : 1
	},
	{
		name   : 'Ada Lovelace',
		number : '39-44-5323523',
		id     : 2
	},
	{
		name   : 'Dan Abramov',
		number : '12-43-234345',
		id     : 3
	},
	{
		name   : 'Mary Poppendieck',
		number : '39-23-6423122',
		id     : 4
	},
	{
		number : '777',
		name   : 'Jake',
		id     : 5
	}
];

app.get('/', (req, res) => {
	res.send('<h1>Sup</h1>');
});

app.get('/info', (req, res) => {
	res.send(
		`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${moment().format(
			'ddd MMM DD YYYY hh:mm:ss A Z'
		)} (${moment.tz.guess()})</p>
    `
	);
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.post('/api/persons', (req, res) => {
	console.log('POST');
	const entry = req.body;
	console.log('New Entry:', entry);

	if (!entry.name || !entry.number) {
		return res.status(400).json({
			error : 'must include name and number'
		});
	}

	const existsAlready = persons
		.map(person => person.name)
		.includes(entry.name);

	console.log('persons:', persons);
	console.log('existsAlready:', existsAlready);

	if (existsAlready) {
		return res.status(400).json({
			error : 'name must be unique'
		});
	}

	entry.id = Math.floor(
		Math.random() * Math.floor(1000000)
	);

	console.log('*** TEST ***');
	console.log('Ad id to new entry:', entry);

	persons = persons.concat(entry);

	res.json(entry);
});

app.get('/api/persons/:id', (req, res) => {
	// console.log(req.params);
	const person = persons.filter(
		person => person.id == req.params.id
	);
	res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
	console.log('DELETE:', req.params);
	persons = persons.filter(
		person => person.id != req.params.id
	);
	res.status(204).end();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
