import { createSelector } from 'redux-starter-kit'

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const xbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'BTC') || {}
  }
)

export const lbtcMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'L-BTC') || {}
  }
)

export const sdotMetaSelector = createSelector(
  assetsInfoSelector,
  assets => {
    return assets.find(asset => asset.name === 'SDOT') || {}
  }
)

export const assetsSelector = state => {
  return state.assets.assets
}

function normalizeAsset(assets, token) {
  const asset = assets.find(asset => asset.name === token)
  if (!asset) {
    return { details: {} }
  }

  const total = Object.values(asset.details).reduce(
    (result, value) => result + value,
    0
  )
  return {
    ...asset,
    details: {
      total,
      ...asset.details
    }
  }
}

export const xbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, 'BTC')
  }
)

export const lbtcAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, 'L-BTC')
  }
)

export const sdotAssetSelector = createSelector(
  assetsSelector,
  assets => {
    return normalizeAsset(assets, 'SDOT')
  }
)
