const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jakedalus:${password}@cluster0.s9ahr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser    : true,
	useUnifiedTopology : true
});

const personSchema = new mongoose.Schema({
	name   : String,
	number : String
});

const Person = mongoose.model('Person', personSchema);

// create a test person:
// const person = new Person({
// 	name   : 'Francis',
// 	number : '555-555-5555'
// });

person.save().then(result => {
	console.log('person saved!', result);
	mongoose.connection.close();
});
