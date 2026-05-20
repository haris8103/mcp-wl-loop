# Backend Server Architecture

Loop backend server is a node js server. It's purpose to provide a platform for music artists to create and manage their own albums, songs, and other related content.There are two modules in this system One is studio for artist to manage there content and other is arena for fans to get the contents of the artist.


## Studio Module

Studio module is for artists to manage their content. It is a web application where artists can create and manage their own albums, songs, galleries, videos and other related content. This platform will be able to provide artist there own live website for their fans to listen to there music and also to participate in the quests and earn rewards. There are two modules in this system One is studio for artist to manage there content and other is arena for fans to listen to there music.

## Loopfans Rewards API Overview



### Base URL
BACKEND URL will be from .env file. It will be in the variable BACKEND_URL. 

### Authentication
Sign up and sign in will be done through typescript sdk: @lil2good/cloud-social-wallet which will return a JWT token and address which will be further be used in all endpoints as a JWT authentication via the `user_cookie` header also store the address and cookie from response of cloud wallet sdk. So add/ it in the auth header of all the requests.
Add the sdk in the package.json of the project. And use it to sign up and sign in with the following example.

### Example
```ts
import {WalletProvider} from "cloud-social-wallet";

function App() {
    return (
        <WalletProvider config={{rpc: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/PJNkurZzzzji8gA6ErLHN', backend_url: 'https://cloud.loop.fans', prefix: 'starknet'}}>
            <WalletApp/>
        </WalletProvider>
    )
}


import {useWallet} from "cloud-social-wallet";

function WalletApp() {
    const {address, cookie, logout, login} = useWallet()
    return (
        <>
            {
                address ? <>
                    <p>{address}</p>
                    <button onClick={logout}>Disconnect</p>
                </> : <>
                    <button onClick={() => login('google')}>Google Login</button>
                     <button onClick={() => login('auth')}>ogin With Email</button>
                </>
            }
        </>
    )
}
```


### Api FLows

#### Signup/Signin

1. signup/signin with cloud wallet sdk
2. POST /v1/user/userInfo to get details of the logged in user (please read resource user-api.md for more details of the api)

#### Onboarding flow (domain setup, Website Design Customization, Pay platform fee (subscription))

3. creating domain for artist arena where fan will be able to view music, galleries, videos and other 
content. Also need to check the domain is available or not. following are the steps

    a. GET /v1/wl/domain/check endpoint to check availability and correctness of the domain (please check 
    resource whitelabel-api.md for more details of the api)

    b. POST /v1/wl/domain endpoint to create domain for the artist in domain it will create a page for the 
    artist where fans can view all the block contents and collections of the artist that domain and domain 
    will be like [domain.loop.fans]. (please check resource whitelabel-api.md for more details of the api)

    c. after the creation of domain an application should be made on this domain and should be publicly 
    available on this domain by gving nginx settings

    d. GET /v1/wl/domain endpoint to get domain details and correctness of the domain (please check 
    resource whitelabel-api.md for more details of the api)

    e. PATCH /v1/wl/domain/active_template/:domain endpoint to update domain active template (please check
     resource whitelabel-api.md for more details of the api)

    f. PATCH /v1/wl/domain/:domain endpoint to update domain configurations like logo, banner, website 
    template, settings etc. (please check resource whitelabel-api.md for more details of the api)

    g. GET /v1/indexer/nfts/owner/nfts/owner/:address/:page/:limit to get the details of the nfts owned by 
    the artist. (please check resource indexer-api.md for more details of the api)

    h. GET /v1/templates to get the list of the templates for the artist domain page. (please check 
    resource whitelabel-api.md for more details of the api)

    i. PATCH /v1/wl/domain/active_template/:domain endpoint to udpate the domain template with the selected
     website template. (please check resource whitelabel-api.md for more details of the api)

4. Plan (subscription module Free/trial/pro)
    
    a. POST /v1/user/billing/upgrade to upgrade to the desired plan which will take to the stripe payment 
    gateway to complete the payment.
    
    b. GET /v1/tiers-n-subscriptions to get all the subscripitons plan details.
    
    c. GET /v1/user/billing/plan to get user's current plan.
    

5. Feature Limit In this we will tell the system that how much features he can utilize according to his/her
 subscription plan.

    a. GET /v1/feature_limits to get the limit of the user (please refer to the resource feature_limits-api.
    md for more details of the api) e.g. Free users will get following features
    
        $0/monthly
        Analytics - locked
        Content Blocks - 4 Maximum
        Events - 1 Maximum
        Free collections - 2 Maximum
        Forms - 1 Maximum
        Fans - Data for 25 Fans

#### Main Studio

6. Dashboard may contain the analytics of the fans growth graph, website views graph, fans summary, website 
view analytics, best selling drops/collections, payout history and monetization.

    a. POST /v1/umami/graph/fansGrowth to get the follower monthlywise data, currnet fans data , followers 
    personal data and percentage month over month. (please check resource umami-api.md for more details of 
    the api)

    b. POST /v1/umami/graph/collections to get the details of the collection/drop which containst the sales 
    of nfts and overall completion percentage of the collections. (please check resource umami-api.md for 
    more details of the api)

    c. POST /v1/user/action/account/balance to get the balance of the artist. (please check resource 
    user-api.md for more details of the api)

    d. POST /v1/user/followerList to get follower details. (please check resource umami-api.md for more 
    details of the api)

    e. POST /v1/umami/graph/stats/range to get the avg daily views and percentage, metadata, website views 
    graph and pageviews monthly and weekly also week days traffic of the provided range with pervious. 
    (please check resource umami-api.md for more details of the api)

    f. POST /v1/umami/dashboard to get the monthly percentage change of the traffic on white label, last 
    two months page views and nft count.  (please check resource umami-api.md for more details of the api)

    g. POST /v1/umami/fans follower details, total fans, current and last month fans. (please check 
    resource umami-api.md for more details of the api)

    h. POST /v1/umami/customers unique owners of nfts count. (please check resource umami-api.md for more 
    details of the api)

    i. POST /v1/umami/revenue total revenue. (please check resource umami-api.md for more details of the 
    api)

    j. GET /v1/fan_funnel/pre_registration/fans/:id/count to get the count of fans who pre registered for 
    the event. (please check resource fan_funnel-api.md for more details of the api)

    k. POST /v1/user/action/payout/history to get the payout history of the artist. (please check resource 
    user-api.md for more details of the api) 
    
7. create content blocks for domain

    a. POST /v1/wl/content_blocks/:domainId endpoint to create content blocks which enables user to rebrand
     his work.(please check resource whitelabel-api.md for more details of the api)

    b. POST /v1/wl/content_blocks endpoint can also be used to create content blocks which enables user to 
    rebrand his work.(please check resource whitelabel-api.md for more details of the api )

    c. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the content blocks on the basis
    of domainId (please check resource whitelabel-api.md for more details of the api )

    d. PATCH /v1/wl/content_blocks/:id endpoint to update content blocks which enables user to rebrand his 
    work.(please check resource whitelabel-api.md for more details of the api )

    e. PUT /v1/wl/content_blocks/:id/reorder endpoint to reorder content blocks which enables user to 
    rebrand his work.(please check resource whitelabel-api.md for more details of the api)

8. In content blocks there are following types of blocks 

    a. albumBlock:
    
      1. POST /v1/blocks/album_block endpoint to create album block artist will be able to upload the 
        block of images of the artist of his related work (please check resource whitelabel-api.md for more 
        details of the api). To upload files of the tracks please use POST v1/file/upload endpoint first 
        and get file id then send it in the album_block creation endpoint (for more details please visit 
        the resource file-api.md file).

      2. PATCH /v1/blocks/album_block/:id endpoint to update album block (please check resource 
        whitelabel-api.md for more details of the api). To upload files of the tracks please use POST v1/
        file/upload endpoint first and get file id then send it in the album_block update endpoint (for 
        more details please visit the resource file-api.md file).

      3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the album block on the basis 
        of domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id endpoint to delete the content block of the album block  in the directus
        (please check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id endpoint to update status of album block (please check 
        resource whitelabel-api.md for more details of the api)

    b. tracksBlock:

      1. POST /v1/blocks/tracks_block to create tracks block artist will be able to upload the block of 
        images of the artist of his related work (please check resource whitelabel-api.md for more details 
        of the api). 

      2. PUT /v1/blocks/tracks_block/:id to update track block (please check resource whitelabel-api.md 
        for more details of the api). 

      3. GET /v1/wl/content_blocks/:domainId to get the details of the track block on the basis of 
        domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id to delete the content block of the track block  in the directus(please 
        check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id to update status of track block (please check resource 
        whitelabel-api.md for more details of the api)

    c. youtubeBlock:

      1. POST /v1/blocks/youtube_block endpoint to create youtube block artist will be able to share the 
        embed url of his youtube videos and it will be displayed in the whitelabel page of the artist 
        (please check resource whitelabel-api.md for more details of the api).

      2. PUT /v1/blocks/youtube_block/:id endpoint to update youtube block (please check resource 
        whitelabel-api.md for more details of the api).

      3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the youtube block on the 
        basis of domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id endpoint to delete the content block of the youtube block  in the directus
        (please check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id endpoint to update status of youtube block (please check 
        resource whitelabel-api.md for more details of the api)

    d. contactBlock:

      1. POST /v1/blocks/contact_block endpoint to create contact block artist will be able to share his
        contact information like email/custom url (please check resource whitelabel-api.md for more 
        details of the api).

      2. PUT /v1/blocks/contact_block/:id endpoint to update contact block (please check resource 
        whitelabel-api.md for more details of the api).

      3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the contact block on the 
        basis of domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id endpoint to delete the content block of the contact block  in the directus
        (please check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id endpoint to update status of contact block (please check 
        resource whitelabel-api.md for more details of the api)

    e. pushFmBlock:

      1. POST /v1/blocks/push_fm_block endpoint to create push fm block artist will be able to share the
        embed url of his push fm and it will be displayed in the whitelabel page of the artist (please 
        check resource whitelabel-api.md for more details of the api). To upload the image for pushFM block 
        please use the post /v1/file/upload endpoint first and get the file id (for more details please 
        visit the resource file-api.md file) and send it the pushFM creation endpoint.

      2. PATCH /v1/blocks/push_fm_block/:id endpoint to update push fm block (please check resource 
        whitelabel-api.md for more details of the api). To upload/change the image for pushFM block please 
        use the post /v1/file/upload endpoint first and get the file id (for more details please visit the
        resource file-api.md file) and send it the pushFM update endpoint

      3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the push fm block on the 
        basis of domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id endpoint to delete the content block of the push fm block  in the directus
        (please check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id endpoint to update status of push fm block (please check 
        resource whitelabel-api.md for more details of the api)

    f. bannerBlock:

      1. POST /v1/blocks/banner_block endpoint to create banner block artist will be able to share the 
        embed url of his banner and it will be displayed in the whitelabel page of the artist (please check
        resource whitelabel-api.md for more details of the api). To upload the banner image use post /v1/
        file/upload endpoint first and get the file id and send it in the banner creation endpoint(for more 
        details please visit the resource file-api.md file).

      2. PATCH /v1/blocks/banner_block/:id endpoint to update banner block (please check resource 
        whitelabel-api.md for more details of the api). To upload/change the image for banner block please 
        use post /v1/file/upload endpoint first and get the file id and send it in the banner update 
        endpoint(for more details please visit the resource file-api.md file).

      3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the banner block on the basis
        of domainId (please check resource whitelabel-api.md for more details of the api)

      4. DELETE /v1/blocks/:id endpoint to delete the content block of the banner block  in the directus
        (please check resource whitelabel-api.md for more details of the api)

      5. PATCH /v1/blocks/update_status/:id endpoint to update status of banner block (please check 
        resource whitelabel-api.md for more details of the api)

9. Event module is where artist can make there events for upcoming items.

    a. POST /v1/wl/events endpoint to create an event for upcoming items (please check resource 
    whitelabel-api.md for more details of the api).

    b. PATCH /v1/wl/events/:id endpoint to edit/update an existing event (please check resource 
    whitelabel-api.md for more details of the api).

    c. DELETE /v1/wl/events/:id endpoint to delete an event (please check resource whitelabel-api.md for 
    more details of the api).

    d. GET /v1/wl/events endpoint to get all events of an artist (please check resource whitelabel-api.md 
    for more details of the api).

    e. POST /v1/wl/events/:id/items endpoint to create an item for an event (please check resource 
    whitelabel-api.md for more details of the api).

    f. PATCH /v1/wl/events/:eventId/items/:itemId endpoint to edit/update an item for an event (please 
    check resource whitelabel-api.md for more details of the api).

    g. DELETE /v1/wl/events/:eventId/items/:itemId endpoint to delete an item for an event (please check 
    resource whitelabel-api.md for more details of the api).

10. News module where artist can create post/feed for all users/community

    a. POST /v1/user/action/post to create a post for all users/community (please check resource arena-api.
    md for more details of the api).
    
    b. POST /v1/arena/profile/feed endpoint to get post/feed for all users/community (please check resource 
    news-api.md for more details of the api).
    
    c. POST /v1/arena/action/like endpoint to like the post/feed (please check resource news-api.md for 
    more details of the api).
    
    d. POST /v1/arena/comments endpoint to like the reply/comment on any post/feed (please check resource 
    news-api.md for more details of the api).

11. Create Launchpads/drops for nft launch with exclusive content for fans. There will be two types of 
launchpads paid drops and free drops.

    a. POST /v1/launchpad/createCollection endpoint to create a new launchpad/drop feature for fans it can
    be paid or free depends on therequests parameters (please read resource launchpad-api.md for 
    moredetails of the api).
    
    b. POST /v1/launchpad/editCollection/:id endpoint to edit an existing launchpad/drop (please read 
    resource launchpad-api.md for more details ofthe api).
    
    c. POST /v1/launchpad/editCollection/update-status/:id to update status of launchpad/drop to live/draft 
    (please read resource launchpad-api.md for more details ofthe api).
    
    d. GET /v1/launchpad/:id to get details of launchpad/drop (please readresource launchpad-api.md for 
    more details of the api)
    
    e. GET /v1/arena/collections/byId/:id endpoint to get all types of launchpads/drops (please read 
    resource arena-api.md for more details of the api)
    
    f. GET /v1/fans/fans_launchpad/insights/:id to get the max supply, sold, total revenue, profit (please 
    read resource arena-api.md for more details of the api)
    
    g. GET /v1/fans/fans_launchpad/insights/transactions/:id/:page to get the max supply, sold, total 
    revenue, profit (please read resource arena-api.md for more details of the api)
    
    h. GET /v1/arena/collections/nft_owners/:id endpoint to get all nft owners who purchased the nfts 
    (please read resource arena-api.md for more details of the api)
    
    i. POST /v1/fans/customers to get the total count of fans, distinct list of fans, page count of 
    customers, nft_data (please read resource arena-api.md for more details of the api)
    
    j. POST /v1/fans/fans_launchpad/transactions/byCollection to get the orders of the drop's NFTS, total 
    revenue, count of fans who purchased NFT (please check resource arena-api.md for more details of the 
    api)

12. In launchpad following are the drop items we can create:

    a. Music Album Drop:

      1. POST /v1/benefit/album to create/update music album drop (please read resource arena-api.md for
        more details of the api).

      2. GET /v1/indexer/nftDetail/:id to get details of music album drop (please read resource arena-api.
        md for more details of the api).

      3. DELETE /v1/benefit/delete endpoint to delete benefit/drop (please read resource arena-api.md for
        more details of the api)

      4. GET /v1/fans/fans_launchpad/:id endpoint to get details of music album drop (please read 
        resource arena-api.md for more details of the api)
        

    b. Video Drop:

      1. POST /v1/benefit/video to create/update video drop (please read resource arena-api.md for more
         details of the api).

      2. GET /v1/indexer/nftDetail/:id to get details of video drop (please read resource arena-api.md 
        for more details of the api).

      3. DELETE /v1/benefit/delete endpoint to delete benefit/drop (please read resource arena-api.md for
         more details of the api)

      4. GET /v1/fans/fans_launchpad/:id endpoint to get details of video drop (please read resource 
        arena-api.md for more details of the api)

    c. Files Drop:

      1. POST /v1/benefit/files to create/update files drop (please read resource arena-api.md for more 
        details of the api).

      2. GET /v1/indexer/nftDetail/:id to get details of files drop (please read resource arena-api.md 
        for more details of the api).

      3. DELETE /v1/benefit/delete endpoint to delete benefit/drop (please read resource arena-api.md for 
        more details of the api)

      4. GET /v1/fans/fans_launchpad/:id endpoint to get details of files drop (please read resource 
        arena-api.md for more details of the api)
    
    d. Gallery Drop:

      1. POST /v1/benefit/gallery to create/update gallery drop (please read resource arena-api.md for 
        more details of the api).

      2. POST /v1/benefit/gallery/:id endpoint to delete gallery item (please read resource arena-api.md 
        for more details of the api).

      3. GET /v1/indexer/nftDetail/:id to get details of gallery drop (please read resource arena-api.md 
        for more details of the api).

      4. DELETE /v1/benefit/delete endpoint to delete benefit/drop (please read resource arena-api.md for
         more details of the api)

      5. GET /v1/fans/fans_launchpad/:id endpoint to get details of gallery drop (please read resource 
        arena-api.md for more details of the api)

13. In studio fan signup form feature will be available for incoming events for the registeration users in
 that event.

    a. POST /v1/fan_funnel/pre_registeration endpoint to create fan signup forms for an event (please read 
    resource arena-api.md for more details of the api).
    
    b. POST /v1/fan_funnel/pre_registeration/:id endpoint to update a new fan signup form for an event 
    (please read resource arena-api.md for more details of the api).
    
    c. DELETE /v1/fan_funnel/pre_registeration/:id endpoint to delete fan signup form for an event (please 
    read resource arena-api.md for more details of the api).    
    
    d. GET /v1/fan_funnel endpoint to get details of all fan signup forms (please read resource arena-api.
    md for more details of the api).
    
    e. GET /v1/fan_funnel/pre_registeration/fans/:id/count endpoint to get count of fans who signed up for 
    an event (please read resource arena-api.md for more details of the api).
    
    f. GET /v1/fan_funnel/pre_registeration/artist/fans endpoint to get details of all fan signup forms 
    submissions for an event (please read resource arena-api.md for more details of the api).
    
    g. POST /v1/fan_funnel/pre_registeration/artist/fans endpoint to get details of all fan signup forms 
    submissions for an event (please read resource arena-api.md for more details of the api).

14. Support module for the artist to provide support technical support.

    a. POST /v1/user/action/sendFormEmail to provide support to the artist


    

## Fan Page (Arena)

  Fan page is the place where  the fans will be able to view the content of the artist. It will be a separate application from the studio and hosted on the domain which is set by the artist in his POST /v1/wl/domain api. The application will also provide NFT to purchase it by fans and get exclusive contents from the artists which will be segregated by paid and free collections. Also there fans can view posts/announcements of the artist made in the studio, fans can like them or can make comment on those posts/announcements. In fan page there will be a section for music library where user can view music drops. 

  ### API's for fan page
  
  #### Signup/Signin

  1. signup/signin with cloud wallet sdk on the home page (Note home page will be visible to every one who visit the site - the fan doesn't need to be registered or logged in. This is an open site)

  #### Home page
  
  1. GET /v1/wl/domain to get domain details
  2. POST /v1/user/userInfo (if user logged in/just signup) to get details of the logged in user (please read resource user-api.md for more details of the api)
  3. https://api-wl.loop.fans/api/items/domains to get the domain details of the artist.
  4. GET https://api-wl.loop.fans/api/items/content_blocks to get the content blocks of the artist.
  5. GET https://api-wl.loop.fans/api/items/fan_funnel to get the fan funnel details of the artist where a fan can register for upcoming events by filling the form.
  6. GET /v1/fan_funnel/pre_registration/:id to get the fan signup form details of a particular fan_funnel.
  7. POST /v1/fan_funnel/:id/register/check to check if the fan is already registered for that fan_funnel item.
  8. POST /v1/fan_funnel/:id/register to register for that fan_funnel item.
  9. GET https://api-wl.loop.fans/api/items/content_blocks to get the content block details of the atrtist.
  10. GET https://api-wl.loop.fans/api/items/fans_launchpad to get the details of the artist paid drops. 
  11. GET https://api-wl.loop.fans/api/items/fans_launchpad_free to get the details of the artist free drops.
  12. GET /v1/fans/fans_launchpad/:id?isId=true to get the details of the artist paid or free drop by providing if fan select particular drop.
  13. POST /v1/user/user-wallets to get the details of the logged in users wallet address.
  14. POST /v1/fans/nft/owner to check the user is owner of the nft.
  15. POST /v1/minter/mint to mint the free drop nft
  16. POST /v1/payment/intent to create payment intent for paid drop for payment of the nft to get the exclusive content of the artist. Stripe is used for payment.


  #### Post/feed/news

  1. POST /v1/arena/profile/feed  to get the feed/announcements of the artist. (Please read resource arena-api.md for more details of the api)
  2. POST /v1/arena/action/like to like/unlike the post/announcement. (Please read resource arena-api.md for more details of the api)
  3. POST /v1/arena/action/comment to comment on the post/announcement. (Please read resource arena-api.md for more details of the api)
  4. POST /v1/arena/comments to get the comments/replies on the post. (Please read resource arena-api.md for more details of the api)