const Show = require("../models/Show");
const {to, resErr, resSucc} = require("../services/response");

async function newShow(req, res) {
	const [err, show] = await to(Show.create(req.body));

	if (err) {
		return resErr(res, err);
	}
	return resSucc(res, show);
}

async function searchByTitleCount(req, res) {
	const [err, count] = await to(Show.count({title: {$regex: req.query.title, $options: "i"}}));

	if (err) {
		return resErr(res, err);
	}
	return resSucc(res, {
		count,
		pages: req.query.limit ? Math.ceil(count / req.query.limit) : undefined
	});
}

async function searchByTitlePaged(req, res) {
	const [err, shows] = await to(
		Show.find({title: {$regex: req.query.title, $options: "i"}})
			.sort({title: 1})
			.skip(req.query.limit * req.query.page)
			.limit(parseInt(req.query.limit))
			.lean()
	);

	if (err) {
		return resErr(res, err);
	} else {
		let associatedShows = req.user.library.shows.map((show) => show.toString());
		let returnedShows = shows.map((show) => ({...show, isAssociated: associatedShows.includes(show._id.toString())}));

		return resSucc(res, returnedShows);
	}
}

async function getOne(req, res) {
	const [err, show] = await to(Show.findById(req.params.id));

	if (err) {
		return resErr(res, err);
	} else if (!show) {
		return resErr(res, "This show does not exist");
	}
	return resSucc(res, show);
}

async function updateOne(req, res) {
	const [err, data] = await to(Show.updateOne({_id: req.params.id}, req.body));

	if (err) {
		return resErr(res, err);
	}
	return resSucc(res, data);
}

module.exports = {newShow, searchByTitleCount, searchByTitlePaged, getOne, updateOne};
