import React from 'react';
import { Router, Link, navigate } from '@reach/router';
import moment from 'moment';
import Timeline, {
	TimelineHeaders,
	SidebarHeader,
	DateHeader,
	TimelineMarkers,
	TodayMarker,
} from 'react-calendar-timeline';
import './timeline.css';
import data from './data.js';

function App() {
	return (
		<div className="app">
			<Router>
				<Artists path="artists" />
				<Artist path="artists/:slug" />
				<Schedule path="schedule" />
			</Router>
		</div>
	);
}

const Schedule = () => {
	// const groups= data.locations.map(l => ({...l, }))
	const items = data.events.map((e) => ({
		...e,
		group: e.location,
		start_time: moment(e.time[0]),
		end_time: moment(e.time[1]),
		title: data.artists[e.artist].title,
	}));
	const minTime = moment('2019-06-07T12:00-05:00');
	const maxTime = moment('2019-06-09T12:00-05:00');

	function onTimeChange(visibleTimeStart, visibleTimeEnd, updateScrollCanvas) {
		if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
			updateScrollCanvas(minTime, maxTime);
		} else if (visibleTimeStart < minTime) {
			updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
		} else if (visibleTimeEnd > maxTime) {
			updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
		} else {
			updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
		}
	}
	function onItemSelect(id, e, time) {
		const event = data.events.find((e) => e.id === id);
		const slug = data.artists.find((a) => a.id === event.artist).slug;
		navigate('/artists/' + slug);
	}
	const currentTime = moment()
		.add(-1.5, 'hours')
		.valueOf();
	return (
		<Timeline
			groups={data.locations}
			items={items}
			defaultTimeStart={moment('2019-06-08T12:00-05:00')
				.add(-1.5, 'hours')
				.valueOf()}
			defaultTimeEnd={moment('2019-06-08T12:00-05:00')
				.add(1.5, 'hours')
				.valueOf()}
			canMove={false}
			lineHeight={50}
			onTimeChange={onTimeChange}
			onItemSelect={onItemSelect}
			maxZoom={60 * 60 * 1000 * 3}
			minZoom={60 * 60 * 1000 * 3}
			itemHeightRatio={0.8}>
			<TimelineMarkers>
				<TodayMarker interval={1000 * 60} />
			</TimelineMarkers>
			<TimelineHeaders>
				<DateHeader unit="primaryHeader" />
				<DateHeader labelFormat="h:mma" />
			</TimelineHeaders>
		</Timeline>
	);
};

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
				{moment(event.time[0]).format('h:mma') +
					' - ' +
					moment(event.time[1]).format('h:mma')}
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
