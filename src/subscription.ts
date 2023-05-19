import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import mysql from 'mysql2/promise';

export class FirehoseSubscription extends FirehoseSubscriptionBase {

  async handleEvent(evt: RepoEvent) {

    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'bluesky_feed',
      password: process.env.MYSQL_PASS,
      database: 'bluesky_alfa',
    });


    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    let words = {
      album: 0,
      alf: 0,
      art: 0, 
      artist: 0,
      ats: 0,
      band: 0,
      banger: 0,
      beautiful: 0,
      butt: 0,
      cat: 0,
      corgi: 0,
      concert: 0,
      dog: 0, 
      doggo: 0, 
      doggy: 0, 
      galaxy: 0,
      happy: 0,
      hashtag: 0,
      hellthread: 0,
      jazz: 0, 
      love: 0,
      music: 0,
      nsfw: 0,
      painting: 0,
      photograph: 0,
      porn: 0,
      pup: 0,
      pupper: 0,
      puppy: 0,
      puppies: 0,
      rocket: 0,
      sculpture: 0,
      song: 0,
      space: 0, 
      video: 0,
      nasa: 0,
      youtube: 0,
      kitten: 0, 
      kitty: 0,
    }

    for (const post of ops.posts.creates) {


      for (let word of Object.keys(words)) {
        const re = new RegExp(` ${word}s?.? `, 'gi')
        let match = post.record.text.match(re)
        if (match) {
          words[word] = 1
        }
      }


      // Art 
      if (words.artist == 1) {
        words.art = 1
      }
      if (words.painting == 1) {
        words.art = 1
      }
      if (words.photograph == 1) {
        words.art = 1
      }
      if (words.sculpture == 1) {
        words.art = 1
      }
      
      // Ats 
      // Clear then look for actual hashtag
      words.ats = 0
      if (post.record.text.indexOf("@") >= 0) {
        words.ats = 1
      }

      // Cat
      if (words.kitten == 1) {
        words.cat = 1
      }
      if (words.kitty == 1) {
        words.cat = 1
      }

      // Dog 
      if (words.doggo == 1) {
        words.cat = 1
      }
      if (words.doggy == 1) {
        words.cat = 1
      }
      if (words.pup == 1) {
        words.cat = 1
      }
      if (words.pupper == 1) {
        words.cat = 1
      }
      if (words.puppies == 1) {
        words.cat = 1
      }
      if (words.puppy == 1) {
        words.cat = 1
      }

      // Hashtags
      // Clear then look for actual hashtag
      words.hashtag = 0
      if (post.record.text.indexOf("#") >= 0) {
        words.hashtag = 1
      }

      // Music
      if (words.album == 1) {
        words.music = 1
      }
      if (words.band == 1) {
        words.music = 1
      }
      if (words.banger == 1) {
        words.music = 1
      }
      if (words.concert == 1) {
        words.music = 1
      }
      if (words.jazz == 1) {
        words.music = 1
      }
      if (words.song == 1) {
        words.music = 1
      }

      // NSFW
      if (words.porn == 1) {
        words.nsfw = 1
      }


      // Space
      // Blank space and only put in NASA for now
      // because space is an overloaded word
      words.space = 0

      if (post.record.text.match(/artemis /i)) {
        words.space = 1
      }
      if (post.record.text.match(/astronomy /i)) {
        words.space = 1
      }
      if (post.record.text.match(/nasa\.gov/i)) {
        words.space = 1
      }
      if (post.record.text.match(/mercury /i)) {
        words.space = 1
      }
      if (post.record.text.match(/venus /i)) {
        words.space = 1
      }
      if (post.record.text.match(/mars /i)) {
        words.space = 1
      }
      if (post.record.text.match(/iss /i)) {
        words.space = 1
      }
      if (post.record.text.match(/jupiter /i)) {
        words.space = 1
      }
      if (post.record.text.match(/saturn /i)) {
        words.space = 1
      }
      if (post.record.text.match(/moon /i)) {
        words.space = 1
      }


      if (words.galaxy == 1) {
        words.space = 1
      }
      if (words.nasa == 1) {
        words.space = 1
      }
      if (words.rocket == 1) {
        words.space = 1
      }

      // Video
      if (words.youtube == 1) {
        words.video = 1
      }

      // console.dir(post)

      console.log(post.record.createdAt)
      console.log(post.record.text)
      console.log("")
      // console.log(post)

      connection.query('insert into posts (raw, url, text, timestamp, alf, art, ats, beautiful, butt, cat, corgi, dog, happy, hashtag, hellthread, love, music, nsfw, space, video) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          JSON.stringify(post),
          post.uri, 
          post.record.text, 
          post.record.createdAt.replace('Z', ' ').replace('Z', ''),
          words.alf, 
          words.art, 
          words.ats, 
          words.beautiful, 
          words.butt, 
          words.cat, 
          words.corgi, 
          words.dog, 
          words.happy, 
          words.hashtag, 
          words.hellthread, 
          words.love, 
          words.music, 
          words.nsfw, 
          words.space, 
          words.video, 
        ]);
    }
    connection.end() 

  }
}
