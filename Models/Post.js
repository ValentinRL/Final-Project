let count = 1;

class Post {
	constructor(title, description, category, images, price, hasShipping, hasPickup,location, user) {
		this.id = count;
		count++;
		this.title = title;
		this.description = description;
		this.category = category;
		this.images = images;
		this.location = location;
		this.price = price;
		this.hasShipping = hasShipping;
		this.hasPickup = hasPickup;

		let date_ob = new Date();
		let date = ('0' + date_ob.getDate()).slice(-2);
		let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
		let year = date_ob.getFullYear();
		this.dop = year + "." + month + "." + date;

		this.user = user;
	}
}

module.exports = Post;
