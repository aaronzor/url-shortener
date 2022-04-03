import mongoose from 'mongoose';
import slugify from 'slugify';
import geocoder from '../../utils/geocoder.js';

const ResturantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name can not be longer than 50 characters']
        },
        slug: String,
        cuisine: {
            type: String,
            maxlength: [
                25,
                'Cuisine length cannot be longer than 25 characters'
            ]
        },
        about: {
            type: String,
            maxlength: [1000, 'About information is limited to 1000 characters']
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL with HTTP or HTTPS'
            ]
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number can not be longer than 20 characters']
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        photo: {
            type: String,
            default: 'no-photo.jpg'
        },
        averageRating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating must can not be more than 10']
        },
        location: {
            // Information GEOcoded from the entered address
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String,
            street: String,
            city: String,
            county: String,
            postalCode: String,
            country: String
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create restaurant slug from the name
ResturantSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Geocode & create location field
ResturantSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        county: loc[0].stateCode,
        postalCode: loc[0].zipcode,
        country: loc[0].countryCode
    };

    // Do not save address in DB
    this.address = undefined;
    next();
});

export default mongoose.model('Restaurant', ResturantSchema);
