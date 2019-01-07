const axios = require("axios");

let TOKEN = null;

const instance = axios.create({
	baseURL: `https://api.thetvdb.com`
});

instance.interceptors.request.use((config) => {
	if (TOKEN != null) {
		config.headers.Authorization = `Bearer ${TOKEN}`;
	}

	return config;
}, undefined);

instance.interceptors.response.use(undefined, (error) => {
	if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
		return getToken().then(
			(response) => {
				TOKEN = response.data.token;

				error.config.__isRetryRequest = true;
				return instance(error.config);
			},
			() => Promise.reject(error)
		);
	}
	return Promise.reject(error);
});

function getToken() {
	return instance({method: "post", url: "/login", data: {apikey: process.env.THETVDB_KEY}});
}

const baseURL = "https://www.thetvdb.com/banners/";
const placeholders = {
	banner: "http://via.placeholder.com/758x140",
	poster: "http://via.placeholder.com/680x1000"
};
function getImageURL(url, type) {
	return url ? baseURL + url : placeholders[type];
}

function searchByName(name) {
	return instance({method: "get", url: "/search/series", params: {name}});
}

function seriesInfo(id, stripped = false) {
	let keys = stripped ? "id,seriesName" : "id,imdbId,seriesName,banner,status,network,genre,overview,slug";

	return instance({method: "get", url: `/series/${id}/filter`, params: {keys}});
}

function seriesEpisodesInfo(id) {
	return instance({method: "get", url: `/series/${id}/episodes/summary`});
}

function seriesPosters(id) {
	return instance({method: "get", url: `/series/${id}/images/query`, params: {keyType: "poster"}});
}

function seriesSeason(id, season) {
	return instance({method: "get", url: `/series/${id}/episodes/query`, params: {airedSeason: season}});
}

module.exports = {getImageURL, searchByName, seriesInfo, seriesEpisodesInfo, seriesPosters, seriesSeason};
