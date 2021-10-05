let count = 1;

class Post {
	constructor(title, description, category, image, price, hasShipping,hasPickup,user) {
        this.id = count;
        count++;
		this.title = title;
		this.description = description;
		this.category = category;
		//this.image = image;
		this.price = price;
		this.hasShipping = hasShipping;
        this.hasPickup = hasPickup;
		this.user = user;
	}
}

module.exports = Post;