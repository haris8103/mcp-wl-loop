# Backend Server Architecture

Loop backend server is a node js server. It is to provide a platform for music artists to create and manage their own albums, songs, and other related content. It is also used to manage the rewards and quests for the users. This platform will be able to provide artist there own live website for there fans to listen to there music and also to participate in the quests and earn rewards. There are two modules in this system One is studio for artist to manage there content and other is arena for fans to listen to there music.


## Studio Module

Studio module is for artists to manage their content. It is a web application where artists can create and manage their own albums, songs, galleries, videos and other related content. It is also used to manage the rewards and quests for the users. This platform will be able to provide artist there own live website for there fans to listen to there music and also to participate in the quests and earn rewards. There are two modules in this system One is studio for artist to manage there content and other is arena for fans to listen to there music.

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

1. signup/signin with cloud wallet sdk
2. creating domain for artist arena where fan will be able to view music, galleries, videos and other content. Also need to check the domain is available or not. following are the steps
    a. GET /v1/wl/domain/check endpoint to check availability and correctness of the domain (please check resource whitelabel-api.md for more details of the api)
    b. POST /v1/wl/domain endpoint to create domain for the artist in domain it will create a page for the artist where fans can view all the block contents and collections of the artist that domain and domain will be like [domain.loop.fans]. (please check resource whitelabel-api.md for more details of the api)
    c. after the creation of domain an application should be made on this domain and should be publicly available on this domain by gving nginx settings
    d. GET /v1/wl/domain endpoint to get domain details and correctness of the domain (please check resource whitelabel-api.md for more details of the api)
    e. PATCH /v1/wl/domain/active_template/:domain endpoint to update domain active template (please check resource whitelabel-api.md for more details of the api)
    f. PATCH /v1/wl/domain/:domain endpoint to update domain configurations like logo, banner, website template, settings etc. (please check resource whitelabel-api.md for more details of the api)
    
3. create content blocks for domain
    a. POST /v1/wl/content_blocks/:domainId endpoint to create content blocks which enables user to rebrand his work.(please check resource whitelabel-api.md for more details of the api)
    b. POST /v1/wl/content_blocks endpoint can also be used to create content blocks which enables user to rebrand his work.(please check resource whitelabel-api.md for more details of the api )
    c. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the content blocks on the basis of domainId (please check resource whitelabel-api.md for more details of the api )
    d. PATCH /v1/wl/content_blocks/:id endpoint to update content blocks which enables user to rebrand his work.(please check resource whitelabel-api.md for more details of the api )
    e. PUT /v1/wl/content_blocks/:id/reorder endpoint to reorder content blocks which enables user to rebrand his work.(please check resource whitelabel-api.md for more details of the api)

4. In content blocks there are following types of blocks 

    a. albumBlock:
        1. POST /v1/blocks/album_block endpoint to create album block artist will be able to upload the block of images of the artist of his related work (please check resource whitelabel-api.md for more details of the api). To upload files of the tracks please use POST v1/file/upload endpoint first and get file id then send it in the album_block creation endpoint (for more details please visit the resource files.md file).
        2. PATCH /v1/blocks/album_block/:id endpoint to update album block (please check resource whitelabel-api.md for more details of the api). To upload files of the tracks please use POST v1/file/upload endpoint first and get file id then send it in the album_block update endpoint (for more details please visit the resource files.md file).
        3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the album block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id endpoint to delete the content block of the album block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id endpoint to update status of album block (please check resource whitelabel-api.md for more details of the api)

    b. tracksBlock:
        1. POST /v1/blocks/tracks_block to create tracks block artist will be able to upload the block of images of the artist of his related work (please check resource whitelabel-api.md for more details of the api). To upload files of the tracks please use POST v1/file/upload endpoint first and get file id and send it in the tracks_block creation endpoint (for more details please visit the resource files.md file).
        2. PUT /v1/blocks/tracks_block/:id to update track block (please check resource whitelabel-api.md for more details of the api). To upload new or update files of the tracks please use POST v1/file/upload endpoint first and get file id then send it in the tracks_block update endpoint (for more details please visit the resource files.md file)
        3. GET /v1/wl/content_blocks/:domainId to get the details of the track block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id to delete the content block of the track block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id to update status of track block (please check resource whitelabel-api.md for more details of the api)

    c. youtubeBlock:
        1. POST /v1/blocks/youtube_block endpoint to create youtube block artist will be able to share the embed url of his youtube videos and it will be displayed in the whitelabel page of the artist (please check resource whitelabel-api.md for more details of the api).
        2. PUT /v1/blocks/youtube_block/:id endpoint to update youtube block (please check resource whitelabel-api.md for more details of the api).
        3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the youtube block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id endpoint to delete the content block of the youtube block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id endpoint to update status of youtube block (please check resource whitelabel-api.md for more details of the api)

    d. contactBlock
        1. POST /v1/blocks/contact_block endpoint to create contact block artist will be able to share his contact information like email/custom url (please check resource whitelabel-api.md for more details of the api).
        2. PUT /v1/blocks/contact_block/:id endpoint to update contact block (please check resource whitelabel-api.md for more details of the api).
        3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the contact block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id endpoint to delete the content block of the contact block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id endpoint to update status of contact block (please check resource whitelabel-api.md for more details of the api)

    e. pushFmBlock
        1. POST /v1/blocks/push_fm_block endpoint to create push fm block artist will be able to share the embed url of his push fm and it will be displayed in the whitelabel page of the artist (please check resource whitelabel-api.md for more details of the api). To upload the image for pushFM block please use the post /v1/file/upload endpoint first and get the file id (for more details please visit the resource files.md file) and send it the pushFM creation endpoint.
        2. PATCH /v1/blocks/push_fm_block/:id endpoint to update push fm block (please check resource whitelabel-api.md for more details of the api). To upload/change the image for pushFM block please use the post /v1/file/upload endpoint first and get the file id (for more details please visit the resource files.md file) and send it the pushFM update endpoint
        3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the push fm block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id endpoint to delete the content block of the push fm block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id endpoint to update status of push fm block (please check resource whitelabel-api.md for more details of the api)

    f. bannerBlock
        1. POST /v1/blocks/banner_block endpoint to create banner block artist will be able to share the embed url of his banner and it will be displayed in the whitelabel page of the artist (please check resource whitelabel-api.md for more details of the api). To upload the banner image use post /v1/file/upload endpoint first and get the file id and send it in the banner creation endpoint(for more details please visit the resource files.md file).
        2. PATCH /v1/blocks/banner_block/:id endpoint to update banner block (please check resource whitelabel-api.md for more details of the api). To upload/change the image for banner block please use post /v1/file/upload endpoint first and get the file id and send it in the banner update endpoint(for more details please visit the resource files.md file).
        3. GET /v1/wl/content_blocks/:domainId endpoint to get the details of the banner block on the basis of domainId (please check resource whitelabel-api.md for more details of the api)
        4. DELETE /v1/blocks/:id endpoint to delete the content block of the banner block  in the directus(please check resource whitelabel-api.md for more details of the api)
        5. PATCH /v1/blocks/update_status/:id endpoint to update status of banner block (please check resource whitelabel-api.md for more details of the api)

## Arena Module

    Arena module will provide whitelable for the artist to present his music videos or anything there, sofan will come and get these things from there. It will be a separate application from the studio and hosted on the domain which is set by the artist in his POST /v1/wl/domain api. The application will also provide NFT to purchase it by fans and get exclusive contents from the artists which will be segregated by paid and free collections