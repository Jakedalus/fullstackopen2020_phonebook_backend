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
morgan.token('body', function(req) {
	return JSON.stringify(req.body);
});

const moment = require('moment-timezone');
// const { response } = require('express');

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

app.get('/info', (req, res, next) => {
	Person.find({})
		.then(persons => {
			res.send(
				`
				<p>Phonebook has info for ${persons.length} people</p>
				<p>${moment().format(
					'ddd MMM DD YYYY hh:mm:ss A Z'
				)} (${moment.tz.guess()})</p>
				`
			);
		})
		.catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
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
		.catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
	console.log('GET /api/persons');
	Person.find({})
		.then(persons => {
			res.json(persons);
		})
		.catch(error => next(error));
});

app.post('/api/persons', async (req, res, next) => {
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
	//// OLD WAY
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

	//// Don't allow repeats
	const alreadyExistingPerson = await Person.findOne({
		name : entry.name
	});

	console.log(
		'alreadyExistingPerson:',
		alreadyExistingPerson
	);

	if (!alreadyExistingPerson) {
		const person = new Person({
			name   : entry.name,
			number : entry.number
		});

		person
			.save()
			.then(savedPerson => {
				res.json(savedPerson);
			})
			.catch(error => next(error));
	} else {
		res.status(500).send({ error: 'name already exists' });
	}
});

app.put('/api/persons/:id', (req, res, next) => {
	console.log('PUT:', req.params, req.body);

	const updatedInfo = {
		name   : req.body.name,
		number : req.body.number
	};

	Person.findByIdAndUpdate(req.params.id, updatedInfo, {
		new           : true,
		runValidators : true,
		context       : 'query'
	})
		.then(updatedNote => {
			res.json(updatedNote);
		})
		.catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	console.log('DELETE:', req.params);

	//// OLD WAY
	// persons = persons.filter(
	// 	person => person.id != req.params.id
	// );

	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			console.log(result);
			res.status(204).end();
		})
		.catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
	console.log('errorHandler, error:', error);
	console.log(
		'errorHandler, error.message:',
		error.message
	);
	console.log('errorHandler, error.name:', error.name);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' });
	}
	if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
