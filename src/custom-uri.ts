import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  customUri,
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  CreatedNFT as CreatedNFTEvent,
  CurrentOwner as CurrentOwnerEvent,
  Transfer as TransferEvent,
  UpdatedTokenUri as UpdatedTokenUriEvent,
} from "../generated/customUri/customUri"
import { EventOccurrence, Token, User } from "../generated/schema"

export function handleCreatedNFT(event: CreatedNFTEvent): void {
  let eventoccurrence = new EventOccurrence(
    getIdFromEventParams(event.params.tokenId, event.params.name, event.block.timestamp)
  )

  let token = new Token(event.params.tokenId.toString())

  let user = User.load(event.params.owner.toHexString())

  if (!user) {
    user = new User(event.params.owner.toHexString())
  }

  eventoccurrence.tokenId = event.params.tokenId
  eventoccurrence.tokenURI = event.params.tokenURI
  eventoccurrence.owner = event.params.owner
  eventoccurrence.type = event.params.name
  eventoccurrence.timestamp = event.block.timestamp

  token.tokenId = event.params.tokenId
  token.tokenURI = event.params.tokenURI
  token.owner = event.params.owner.toHexString()
  token.createdAtTimestamp = event.block.timestamp

  eventoccurrence.save()
  token.save()
  user.save()
}

export function handleTransfer(event: TransferEvent): void {
  let eventoccurrence = new EventOccurrence(
    getTransferIdFromEventParams(event.params.tokenId, event.params.from, event.block.timestamp)
  )

  let token = Token.load(event.params.tokenId.toString())

  if (!token) {
    token = new Token(event.params.tokenId.toString())
  }

  let user = User.load(event.params.to.toHexString())

  if (!user) {
    user = new User(event.params.to.toHexString())
  }

  eventoccurrence.tokenId = event.params.tokenId
  eventoccurrence.owner = event.params.from
  eventoccurrence.newOwner = event.params.to
  eventoccurrence.type = "Transfer"
  eventoccurrence.timestamp = event.block.timestamp

  token.tokenId = event.params.tokenId
  token.owner = event.params.to.toHexString()

  eventoccurrence.save()
  token.save()
  user.save()
}

export function handleUpdatedTokenUri(event: UpdatedTokenUriEvent): void {
  let eventoccurrence = new EventOccurrence(
    getIdFromEventParams(event.params.tokenId, event.params.name, event.block.timestamp)
  )

  let token = Token.load(event.params.tokenId.toString())

  if (!token) {
    token = new Token(event.params.tokenId.toString())
  }

  eventoccurrence.tokenId = event.params.tokenId
  eventoccurrence.tokenURI = event.params.tokenURI
  eventoccurrence.owner = event.params.owner
  eventoccurrence.type = event.params.name
  eventoccurrence.timestamp = event.block.timestamp

  token.tokenURI = event.params.tokenURI

  eventoccurrence.save()
  token.save()
}

export function handleCurrentOwner(event: CurrentOwnerEvent): void {
  let eventoccurrence = new EventOccurrence(
    getIdFromEventParams(event.params.tokenId, event.params.name, event.block.timestamp)
  )

  let token = Token.load(event.params.tokenId.toString())

  if (!token) {
    token = new Token(event.params.tokenId.toString())
  }

  let user = User.load(event.params.owner.toHexString())

  if (!user) {
    user = new User(event.params.owner.toHexString())
  }

  eventoccurrence.tokenId = event.params.tokenId
  eventoccurrence.owner = event.params.owner
  eventoccurrence.type = event.params.name
  eventoccurrence.timestamp = event.block.timestamp

  token.owner = event.params.owner.toHexString()

  eventoccurrence.save()
  token.save()
  user.save()

}

function getIdFromEventParams(tokenId: BigInt, eventName: String, timestamp: BigInt): string {
  return tokenId.toHexString() + eventName.toString() + timestamp.toHexString()
}

function getTransferIdFromEventParams(tokenId: BigInt, from: Address, timestamp: BigInt): string {
  return tokenId.toHexString() + from.toHexString() + timestamp.toHexString()
}


// export function handleApproval(event: ApprovalEvent): void { }

// // Note: If a handler doesn't require existing field values, it is faster
// // _not_ to load the entity from the store. Instead, create it fresh with
// // `new Entity(...)`, set the fields that should be updated and save the
// // entity back to the store. Fields that were not set or unset remain
// // unchanged, allowing for partial updates to be applied.

// // It is also possible to access smart contracts from mappings. For
// // example, the contract that has emitted the event can be connected to
// // with:
// //
// // let contract = Contract.bind(event.address)
// //
// // The following functions can then be called on this contract to access
// // state variables and other data:
// //
// // - contract.balanceOf(...)
// // - contract.getApproved(...)
// // - contract.getTokenCounter(...)
// // - contract.isApprovedForAll(...)
// // - contract.mintNFT(...)
// // - contract.name(...)
// // - contract.ownerOf(...)
// // - contract.supportsInterface(...)
// // - contract.symbol(...)
// // - contract.tokenURI(...)
// // - contract.updateNFT(...)
// export function handleApprovalForAll(event: ApprovalForAllEvent): void { }
