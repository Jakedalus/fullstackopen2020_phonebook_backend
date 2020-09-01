const express = require('express');
const app = express();

const moment = require('moment-timezone');

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
