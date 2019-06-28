import React from 'react';
import { Router, Link } from '@reach/router';
import data from './data.js';
import dayjs from 'dayjs';

function App() {
	return (
		<div className="app">
			<Router>
				<Artists path="artists" />
				<Artist path="artists/:slug" />
			</Router>
		</div>
	);
}

const Artists = () => (
	<div className="artists">
		<h3>Artists</h3>
		<ArtistList />
	</div>
);

const Artist = ({ slug }) => {
	const { id, title, photo, bio, links } = data.artists.find((a) => a.slug === slug);
	return (
		<div className="artist">
			<img src={photo} />
			<h3>{title}</h3>
			<div>
				{links.soundcloud && <a href={links.soundcloud}>Soundcloud</a>}
				{links.facebook && <a href={links.facebook}>Facebook</a>}
				{links.instagram && <a href={links.instagram}>Instagram</a>}
				{links.ra && <a href={links.ra}>Resident Advisor</a>}
			</div>
			<SetList id={id} />
			<p>{bio}</p>
		</div>
	);
};

const SetList = ({ id }) => {
	const events = data.events.filter((e) => e.artist === id);
	return (
		<div>
			{events.map((e) => (
				<SetItem event={e} />
			))}
		</div>
	);
};

const SetItem = ({ event }) => {
	return (
		<div>
			<div>{data.locations[event.location].title}</div>
			<div>
				{dayjs(event.time[0]).format('h:mma') +
					' - ' +
					dayjs(event.time[1]).format('h:mma')}
			</div>
		</div>
	);
};

const ArtistList = () => (
	<div className="artist-list">
		{data.artists.map((a) => (
			<ArtistItem key={a.id} artist={a} />
		))}
	</div>
);

const ArtistItem = ({ artist }) => {
	const { slug, title, photo } = artist;
	return (
		<Link to={'/artists/' + slug}>
			<div className="artist-item">
				<img className="artist-photo" src={photo} />
				<div className="artist-title">{title}</div>
			</div>
		</Link>
	);
};

export default App;
