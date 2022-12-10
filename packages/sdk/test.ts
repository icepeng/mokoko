import {getMeshSDK} from './.mesh'

const sdk = getMeshSDK();

const res = sdk.GetAuctionItems({
    CategoryCode: 200000
})
