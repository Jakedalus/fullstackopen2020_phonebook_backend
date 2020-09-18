require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

app.use(express.json());
app.use(cors());

app.use(express.static('build'));

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

const PORT = process.env.PORT;

// let persons = [
// 	{
// 		name   : 'Arto Hellas',
// 		number : '040-123456',
// 		id     : 1
// 	},
// 	{
// 		name   : 'Ada Lovelace',
// 		number : '39-44-5323523',
// 		id     : 2
// 	},
// 	{
// 		name   : 'Dan Abramov',
// 		number : '12-43-234345',
// 		id     : 3
// 	},
// 	{
// 		name   : 'Mary Poppendieck',
// 		number : '39-23-6423122',
// 		id     : 4
// 	},
// 	{
// 		number : '777',
// 		name   : 'Jake',
// 		id     : 5
// 	}
// ];

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

app.get('/api/persons/:id', (req, res) => {
	// console.log(req.params);

	// Old Way
	// const person = persons.filter(
	// 	person => person.id == req.params.id
	// );
	// res.json(person);

	Person.findById(req.params.id)
		.then(person => {
			console.log('GET /api/persons/:id', person);
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch(error => {
			console.log(error);
			res.status(400).send({ error: 'malformed id' });
		});
});

app.get('/api/persons', (req, res) => {
	console.log('GET /api/persons');
	Person.find({})
		.then(persons => {
			res.json(persons);
		})
		.catch(error => {
			res.json({ error });
		});
});

app.post('/api/persons', (req, res) => {
	console.log('POST');
	const entry = req.body;
	console.log('New Entry:', entry);

	if (entry === undefined) {
		return res
			.status(400)
			.json({ error: 'content missing' });
	}

	if (!entry.name || !entry.number) {
		return res.status(400).json({
			error : 'must include name and number'
		});
	}

	// Check if entry exists already
	// const existsAlready = persons
	// 	.map(person => person.name)
	// 	.includes(entry.name);

	// console.log('persons:', persons);
	// console.log('existsAlready:', existsAlready);

	// if (existsAlready) {
	// 	return res.status(400).json({
	// 		error : 'name must be unique'
	// 	});
	// }

	// entry.id = Math.floor(
	// 	Math.random() * Math.floor(1000000)
	// );
	// console.log('*** TEST ***');
	// console.log('Ad id to new entry:', entry);

	const person = new Person({
		name   : entry.name,
		number : entry.number
	});

	person.save().then(savedPerson => {
		res.json(savedPerson);
	});

	// persons = persons.concat(entry);

	// res.json(entry);
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
