import { fileSortFunctions } from '../fileSortFunctions.js'
import { shareTypes } from '../helpers/shareTypes'

export default {
  inProgress: state => {
    return state.inProgress
  },
  selectedFiles: state => {
    if (state.selected.length === 0) {
      return []
    } else {
      return state.selected
    }
  },
  files: state => {
    return state.files
  },
  currentFolder: state => {
    return state.currentFolder
  },
  // a flat file list has no current folder nor parent
  flatFileList: state => !!state.currentFolder,
  searchTerm: state => {
    return state.searchTermGlobal
  },
  atSearchPage: state => {
    return state.searchTermGlobal !== ''
  },
  activeFiles: state => {
    // if searchTermGlobal is set, replace current file list with search results
    const files = state.searchTermGlobal ? state.filesSearched : state.files
    // make a copy of array for sorting as sort() would modify the original array
    return ([].concat(files)).sort(fileSortFunctions[state.fileSortMode])
  },
  filesTotalSize: (state, getters) => {
    let totalSize = 0
    for (const file of getters.activeFiles) {
      totalSize += parseInt(file.size, 10)
    }

    return totalSize
  },
  activeFilesCount: (state, getters) => {
    const files = getters.activeFiles.filter(file => file.type === 'file')

    const folders = getters.activeFiles.filter(file => file.type === 'folder')

    return {
      files: files.length,
      folders: folders.length
    }
  },
  davProperties: state => {
    return state.davProperties
  },
  dropzone: state => {
    return state.dropzone
  },
  currentFileOutgoingCollaborators: state => {
    const userShareTypes = [shareTypes.user, shareTypes.group, shareTypes.guest, shareTypes.remote]
    return state.currentFileOutgoingShares.filter(share => {
      return userShareTypes.includes(parseInt(share.shareType, 10))
    })
  },
  currentFileOutgoingLinks: state => {
    return state.currentFileOutgoingShares.filter(share => {
      return parseInt(share.shareType, 10) === shareTypes.link
    })
  },
  currentFileOutgoingSharesLoading: state => {
    return state.currentFileOutgoingSharesLoading
  },
  sharesTree: state => state.sharesTree,
  sharesTreeLoading: state => state.sharesTreeLoading,
  loadingFolder: state => {
    return state.loadingFolder || state.sharesTreeLoading
  },
  quota: state => {
    return state.quota
  },
  trashbinDeleteMessage: state => {
    return state.trashbinDeleteMessage
  },
  deleteDialogMessage: state => {
    return state.deleteDialogMessage
  },
  overwriteDialogTitle: state => {
    return state.overwriteDialogTitle
  },
  overwriteDialogMessage: state => {
    return state.overwriteDialogMessage
  },
  highlightedFile: state => {
    return state.highlightedFile
  },
  publicLinkPassword: state => {
    return state.publicLinkPassword
  },
  uploaded: state => state.uploaded,
  renameDialogOpen: state => state.renameDialogOpen,
  renameDialogNewName: state => state.renameDialogNewName,
  renameDialogOriginalName: state => state.renameDialogOriginalName,
  actionsInProgress: state => state.actionsInProgress,
  isDialogOpen: state => {
    // FIXME: need a more obvious dialog state management
    return state.renameDialogOpen || state.deleteDialogOpen
  },
  renameDialogSelectedFile: state => state.renameDialogSelectedFile,
  deleteDialogOpen: state => state.deleteDialogOpen,
  deleteDialogSelectedFiles: state => state.deleteDialogSelectedFiles
}
