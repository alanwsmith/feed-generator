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


    for (const post of ops.posts.creates) {

      // let hashtag = 0
      // let cat = 0
      // let dog = 0
      // let butt = 0
      // let space = 0
      // let gifs = 0
      // let music = 0
      // let secret = 0
      // let skeeet = 0
      // let hellthread = 0
      // let nsfw = 0
      // let videos= 0



      console.log(post.record.text)
      connection.query('insert into posts (url, text, timestamp) values(?, ?, ?)',
        [post.uri, post.record.text, post.record.createdAt.replace('Z', ' ').replace('Z', '')]);
    }
    connection.end() 

    // // const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    // // const postsToCreate = ops.posts.creates
    //   // .filter((create) => {
    //   //   // only alf-related posts
    //   //   return create.record.text.toLowerCase().includes('alf')
    //   // })
    //   .map((create) => {
    //     // map alf-related posts to a db row
    //     return {
    //       uri: create.uri,
    //       cid: create.cid,
    //       replyParent: create.record?.reply?.parent.uri ?? null,
    //       replyRoot: create.record?.reply?.root.uri ?? null,
    //       indexedAt: new Date().toISOString(),
    //     }
    //   })

    // if (postsToDelete.length > 0) {
    //   await this.db
    //     .deleteFrom('post')
    //     .where('uri', 'in', postsToDelete)
    //     .execute()
    // }
    // if (postsToCreate.length > 0) {
    //   await this.db
    //     .insertInto('post')
    //     .values(postsToCreate)
    //     .onConflict((oc) => oc.doNothing())
    //     .execute()
    // }

  }
}
