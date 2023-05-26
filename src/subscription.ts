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
      spotify: 0,
      video: 0,
      nasa: 0,
      youtube: 0,
      kitten: 0,
      kitty: 0,
    }

    let regex_bans = [
      ' #?biden ', 
      ' #?trump ', 
      'nazi', 
      ' #?elon ', 
      ' #?musk ', 
      ' #?cop ', 
      ' #?cops ',
      ' #?republican ', 
      ' #?democrat ', 
      ' #?senate ', 
      ' #?senator ',
      ' #?capitalist ',
      ' #?neolibrealism ', 
      ' #?fascism ', 
      ' #?america ',
      ' #?violence ', 
      ' #?kill ', 
      ' #?killer ', 
      ' #?hate ', 
      ' #?chatgpt ',
      ' #?bad ', 
      ' #?desantis ', 
      ' matt walsh ', 
      ' #?fl ', 
      ' #?florida ',
      ' #?conservative ', 
      ' #?abortion ', 
      ' #?abortions ', 
      ' pro-choice',
      ' pro choice',
      ' #?shitty ', 
      ' #?facist ', 
      ' #?facists ', 
      ' #?foxnews ', 
      ' fox news ', 
      ' #?cnn ', 
      ' #?msnbc ',
      ' #?funeral ', 
      ' #?horrible ', 
      ' #?sadist ', 
      ' #?sadists ', 
      ' #?healthcare ',
      ' #?taxes',
      ' right wing ', 
      ' left wing ', 
      ' right-wing ', 
      ' left-wing ', 
      ' #?war ', 
      ' #?torture ', 
      ' #?shitpost ', 
      // this one was flooding the feed.
      '@lovefairy.nl', 
      // this one was flooding the feed.
      '@19box.bsky.social', 
      ' #?nigger', ' #supremacist ',
      '1488', ' 88 '
    ]

    for (const post of ops.posts.creates) {
      for (let word of Object.keys(words)) {
        const re = new RegExp(` ${word}s?.? `, 'gi')
        let match = post.record.text.match(re)
        if (match) {
          words[word] = 1
        }
      }

      // Art 
      if (post.record.text.indexOf(" art ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?art ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?artist ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?photograph ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?portrait ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?photography ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?painting ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?drawing ") >= 0) {
        words.ats = 1
      }
      if (post.record.text.indexOf(" #?blackandwhite ") >= 0) {
        words.ats = 1
      }

      // Ats 
      // Clear then look for actual hashtag
      words.ats = 0
      if (post.record.text.indexOf("@") >= 0) {
        words.ats = 1
      }

      // Cat
      // clear and reset
      words.cat = 0
      if (post.record.text.indexOf("cat ") >= 0) {
        words.cat = 1
      }
      if (post.record.text.indexOf(" #?cat ") >= 0) {
        words.cat = 1
      }
      if (post.record.text.indexOf(" #?cats ") >= 0) {
        words.cat = 1
      }
      if (post.record.text.indexOf(" #?kitten ") >= 0) {
        words.cat = 1
      }
      if (post.record.text.indexOf(" #?kittens ") >= 0) {
        words.cat = 1
      }
      if (post.record.text.indexOf(" #?kitty ") >= 0) {
        words.cat = 1
      }

      // Dog 
        words.dog = 0
      if (post.record.text.indexOf("dog ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf("puppy ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?dog ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?dogs ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?doggo ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?doggos ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?doggy ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?pup ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?puppy ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?puppies ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?pupper ") >= 0) {
        words.dog = 1
      }
      if (post.record.text.indexOf(" #?floofer ") >= 0) {
        words.dog = 1
      }

      // Hashtags
      // Clear then look for actual hashtag
      words.hashtag = 0
      if (post.record.text.indexOf(" #") >= 0) {
        words.hashtag = 1
      }
      

      // Happy 
      if (post.record.text.indexOf(" #?happy ") >= 0) {
        words.happy = 1
      }
      if (post.record.text.indexOf(" #?happiness ") >= 0) {
        words.happy = 1
      }
      if (post.record.text.indexOf(" #?joy ") >= 0) {
        words.happy = 1
      }


      // Love
      words.love = 0
      if (post.record.text.indexOf(" #?love ") >= 0) {
        words.love = 1
      }
      if (post.record.text.indexOf(" #?loving ") >= 0) {
        words.love = 1
      }

      // Music
      if (post.record.text.indexOf(" #music") >= 0) {
        words.music = 1
      }
      if (post.record.text.indexOf(" #musican") >= 0) {
        words.music = 1
      }
      if (post.record.text.indexOf(" #song ") >= 0) {
        words.music = 1
      }
      if (post.record.text.indexOf(" #songs ") >= 0) {
        words.music = 1
      }
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
      if (post.record.text.match(/ #?nsfw /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?tit /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?titty /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?tits /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?lewd /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?porn /i)) {
        words.nsfw = 1
      }
      // not useing just the word because it gets used 
      // too much in non-nsfw ways
      if (post.record.text.match(/ #ass /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?pussy /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?cock /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?dick /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?nude /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?cum /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?boobs /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?boob /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/ #?butt /i)) {
        words.nsfw = 1
      }



      // NSFW
      if (post.record.text.match(/#nsfwalf /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#nsfw /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#tit /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#tits /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#lewd /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#porn /i)) {
        words.nsfw = 1
      }
      // not useing just the word because it gets used 
      // too much in non-nsfw ways
      if (post.record.text.match(/#ass /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#pussy /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#cock /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#dick /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#nude /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#cum /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#boob /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#boobs /i)) {
        words.nsfw = 1
      }
      if (post.record.text.match(/#butt /i)) {
        words.nsfw = 1
      }

      // Space
      // Blank space and only put in NASA for now
      // because space is an overloaded word
      words.space = 0

      if (post.record.text.match(/space station/i)) {
        words.space = 1
      }
      if (post.record.text.match(/artemis /i)) {
        words.space = 1
      }

      // if (post.record.text.match(/astronomy /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/nasa\.gov/i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/mercury /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/venus /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/mars /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/ iss /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/jupiter /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/saturn /i)) {
      //   words.space = 1
      // }
      // if (post.record.text.match(/ jpl /i)) {
      //   words.space = 1
      // }

      if (post.record.text.match(/ nasa /i)) {
        words.space = 1
      }
      //if (post.record.text.match(/moon /i)) {
      // words.space = 1
      // }
      if (words.galaxy == 1) {
        words.space = 1
      }
      if (words.nasa == 1) {
        words.space = 1
      }
      if (words.rocket == 1) {
        words.space = 1
      }


      // Spotify
      words.spotify = 0
      if (post.record.text.match(/\shttps:\/\/open.spotify.com\/track/i)) {
        words.spotify = 1
      }

      // Video
      if (words.youtube == 1) {
        words.video = 1
      }


      // Remove banned words
      regex_bans.forEach((regex_ban) => {
        let re = new RegExp(regex_ban, 'gi')
        if (post.record.text.match(re)) {
          for (let word of Object.keys(words)) {
            words[word] = 0
          }
        }
      })


      // console.dir(post)

      console.log(post.record.createdAt)
      console.log(post.record.text)
      console.log("")
      // console.log(post)

      connection.query('insert into posts (author_id, raw, url, text, timestamp, alf, art, ats, beautiful, butt, cat, corgi, dog, happy, hashtag, hellthread, love, music, nsfw, space, spotify, video) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          post.author,
          JSON.stringify(post),
          post.uri,
          post.record.text,
          post.record.createdAt
            .replace('Z', '')
            .replace('+0300', '')
            .replace('+0200', '')
            .replace('+0100', '')
            .replace('+0000', '')
            .replace('-0000', '')
            .replace('-0100', '')
            .replace('-0200', '')
            .replace('-0300', '')
            .replace('-0400', '')
            .replace('-0500', '')
            .replace('-0600', '')
            .replace('-0700', '')
            .replace('-0800', '')
            .replace('-0900', ''),
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
          words.spotify,
          words.video,
        ]);
    }
    connection.end()

  }
}
