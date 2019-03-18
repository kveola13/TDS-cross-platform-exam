export class Post {
  constructor(
    //Body is the title of the book, because this was the way the lecturer wrote it
    //Even though I could rename it, it's been this way since the start of the semester
    public body: string,
    //Author of the book being sold
    public bookAuthor: string,
    public price: string,
    public imageURL: string,
    //The Author of the post, the seller.
    public author: string,
    public email: string,
    //Condition of the book. I.E is it almost ruined, or in mint condition?
    public bookCondition: string,
    //The formatted address of the book
    public location: string,
    //Latitude and Longitude so you can place a marker
    public lat: number,
    public lng: number,
    //The date of the book being sold.
    public date: string,
    public id?: string) {
  }
}
