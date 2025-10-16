# Marketplace Platform - Technical Specification

## Project Overview

A comprehensive classified ads marketplace platform for buying and selling new and used goods, featuring multi-level categories, integrated messaging, storefronts, and payment processing.

---

## User Roles & Permissions

### 1. Administrator

**Access & Capabilities:**
- Full access to admin panel
- Analytics dashboard with platform-wide metrics
- User management (view, edit, suspend, delete users)
- Listing moderation and management
- Conversation monitoring (connection tracking only, not message content)
- Category management
- Payment and transaction oversight

**Key Responsibilities:**
- Platform moderation
- User support
- Content policy enforcement
- System configuration

### 2. Active User (Registered)

**Access & Capabilities:**
- Create, edit, and delete listings
- Messaging system for buyer-seller communication
- Purchase functionality
- Personal analytics dashboard
- Storefront creation and management
- Rating and review system (give and receive)
- Payment processing
- Order history

**Profile Features:**
- Profile customization
- Verification badges
- Seller ratings
- Transaction history

### 3. Guest (Unauthenticated)

**Access & Capabilities:**
- Browse all public listings
- View categories and subcategories
- Search and filter listings
- View seller storefronts (read-only)
- View listing details

**Restrictions:**
- Cannot message sellers
- Cannot make purchases
- Cannot create listings
- Prompted to register for full functionality

---

## Category System

### Structure

**Multi-Level Hierarchy:**
- Parent categories (static)
- Subcategories (multiple levels deep)
- Flexible nesting structure

**Example Structure:**
```
Electronics
├── Computers
│   ├── Laptops
│   ├── Desktops
│   └── Components
│       ├── CPU
│       ├── GPU
│       └── RAM
├── Mobile Phones
│   ├── Smartphones
│   └── Feature Phones
└── Audio
    ├── Headphones
    └── Speakers
```

### Features

**Search:**
- Full-text search within categories
- Cross-category search
- Autocomplete suggestions

**Sorting:**
- Price (low to high, high to low)
- Date posted (newest, oldest)
- Popularity
- Distance/location
- Rating

**Filtering:**
- Price range
- Condition (new, used, refurbished)
- Location
- Seller type (individual, store)
- Custom category-specific filters

**Suggestions:**
- Related categories
- Popular categories
- "Users also browsed" recommendations

---

## Listings

### Core Information

**Required Fields:**
- Title
- Description
- Category and subcategory
- Price
- Condition (new, used, like new, refurbished)
- Location

**Optional Fields:**
- Brand
- Model
- Year/age
- Custom specifications

### Images

**Gallery Features:**
- Multiple image upload (minimum 1, maximum 10-15)
- Primary image selection
- Image reordering
- Image compression and optimization
- Zoom functionality
- Lightbox gallery view

### Metadata

**System-Generated:**
- Listing ID
- Publication date
- Last modified date
- View count
- Save/favorite count
- Listing status (active, sold, expired, removed)

**User-Provided:**
- Custom tags
- Product specifications
- Warranty information
- Purchase date (for used items)

### Advanced Features

**Conversations:**
- Built-in messaging per listing
- Buyer-seller communication
- Message notifications
- Offer negotiation

**Ratings & Reviews:**
- Star rating system (1-5 stars)
- Written reviews
- Seller rating aggregation
- Verified purchase badges

**Trading & Commerce:**
- Integrated payment processing
- Secure checkout
- Multiple payment methods
- Order tracking

**Shipping/Delivery:**
- Shipping options (local pickup, shipping, delivery)
- Shipping cost calculator
- Carrier integration
- Tracking number support

**Promoted Listings:**
- Paid promotion options
- Featured placement
- Category highlighting
- Homepage showcase
- Extended duration

**Listing Duration:**
- Standard listing period (e.g., 30 days)
- Automatic expiration
- Renewal options
- Extended duration for promoted listings
- Email notifications before expiration

**Ordering & Display:**
- Default: newest first (by publication date)
- Sticky promoted listings
- Algorithm-based relevance sorting

---

## Messaging System

### Conversation Structure

**Per-Listing Conversations:**
- One conversation thread per listing
- Two-party communication (buyer and seller only)
- Conversation tied to specific listing

### Features

**Core Functionality:**
- Real-time messaging
- Message history
- Read receipts
- Typing indicators
- Push notifications

**Safety & Moderation:**
- Report inappropriate messages
- Block users
- Automated spam detection
- Link and contact information filtering (optional security feature)

**Organization:**
- Inbox with conversation list
- Unread message counter
- Search within conversations
- Archive conversations

---

## Storefronts

### Overview

Dedicated seller pages similar to KupujemProdajem (KP) showcase format, allowing sellers to create a branded presence on the platform.

### Customization Features

**Store Identity:**
- Store name
- Store logo/banner image
- Store description
- Contact information
- Business hours (for professional sellers)

**Layout Options (CMS-like):**
- Widget-based layout system
- Customizable sections:
  - Featured products
  - New arrivals
  - Best sellers
  - About us section
  - Custom promotional banners
- Drag-and-drop interface for arrangement

**Store Analytics:**
- Total views
- Total sales
- Active listings count
- Response rate
- Average rating

### Store Page Components

**Header:**
- Store banner
- Logo
- Store name
- Rating summary
- Follow/favorite button

**Navigation:**
- All listings
- Categories (seller's listings filtered)
- About
- Contact
- Reviews

**Content Area:**
- Listing grid/list view
- Featured items section
- Store policies (return, shipping, etc.)

**Sidebar:**
- Store statistics
- Quick contact
- Social media links
- Verified badges

---

## User Flows

### Guest User Flow
1. Land on homepage
2. Browse categories or search
3. View listings
4. Prompted to register to contact seller or purchase
5. Registration/login
6. Continue as Active User

### Seller Flow
1. Login to account
2. Navigate to "Create Listing"
3. Fill in listing details
4. Upload images
5. Set price and options
6. Publish listing
7. Receive messages from interested buyers
8. Negotiate and complete sale
9. Receive payment and ratings

### Buyer Flow
1. Search or browse for items
2. View listing details
3. Contact seller via messaging
4. Negotiate price/details
5. Proceed to checkout
6. Complete payment
7. Receive item
8. Leave rating and review

---

## Security & Privacy

### Data Protection
- GDPR/CCPA compliance
- Encrypted communications
- Secure payment processing
- Password hashing (bcrypt)
- Two-factor authentication (optional)

### Content Moderation
- Automated content filtering
- User reporting system
- Admin review queue
- Prohibited items list
- Suspicious activity detection

### Fraud Prevention
- Identity verification
- Payment escrow system
- Buyer/seller protection policies
- Dispute resolution process

---

## Analytics & Reporting

### Administrator Analytics
- Total users (active, inactive, new)
- Total listings (active, sold, expired)
- Revenue metrics
- Category performance
- User engagement metrics
- Geographic distribution

### User Analytics (Personal Dashboard)
- Listing views
- Favorite count
- Message response rate
- Successful sales
- Average selling price
- Listing performance comparison

---

## Future Enhancements

- Mobile applications (iOS/Android)
- AI-powered price suggestions
- Image recognition for category suggestions
- Auction functionality
- Video support for listings
- Integration with social media
- Advanced seller tools (inventory management, bulk uploads)
- Internationalization and multi-language support

---