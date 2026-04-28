# Backend Server Architecture

Loop backend server is a node js server. It is to provide a platform for music artists to create and manage their own albums, songs, and other related content. It is also used to manage the rewards and quests for the users. This platform will be able to provide artist there own live website for there fans to listen to there music and also to participate in the quests and earn rewards. There are two modules in this system One is studio for artist to manage there content and other is arena for fans to listen to there music.


## Studio Module

Studio module is for artists to manage their content. It is a web application where artists can create and manage their own albums, songs, galleries, videos and other related content. It is also used to manage the rewards and quests for the users. This platform will be able to provide artist there own live website for there fans to listen to there music and also to participate in the quests and earn rewards. There are two modules in this system One is studio for artist to manage there content and other is arena for fans to listen to there music.

## Loopfans Rewards API Overview



### Base URL
https://proalien-nevaeh-tachygraphical.ngrok-free.dev

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
    a. GET /v1/wl/domain/check to check availability and correctness of the domain (please check whitelabel-api.md for more details of the api in the current directory)
    b. POST /v1/wl/domain to create domain for the artist in domain it will create a page for the artist where fans can view all the block contents and collections of the artist that domain and domain will be like [domain.loop.fans]. (please check whitelabel-api.md for more details of the api in the current directory)
    c. after the creation of domain an application should be made on this domain and should be publicly available on this domain by gving nginx settings
    
    
3. create content blocks for domain
    a. Post /v1/wl/content_blocks to create api
    b. /v1/wl/content_blocks/:domainId to get api
    c. /v1/wl/content_blocks/:domainId to update api
    d. /v1/wl/content_blocks/:domainId to delete api
4. after that there will be 2 sections 
    a. collection for new music tracks, albums, videos, galleries etc also on creation collection an nft collection will be created which will allow user to buy nft to get access to these exclusive content
    b. whitelable where will artist will create content blocks for arena and fascilitate the artist to promote there brand, music, videos from other platforms.

## Arena Module

    Arena module will provide whitelable for the artist to present his music videos or anything there, sofan will come and get these things from there. It will be a separate application from the studio and hosted on the domain which is set by the artist in his POST /v1/wl/domain api. The application will also provide NFT to purchase it by fans and get exclusive contents from the artists which will be segregated by paid and free collections