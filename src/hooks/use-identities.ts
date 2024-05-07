// import { useQuery } from 'react-query'

// // Custom hook
// export function useIdentities(addresses: string[]) {
//   const { api, chainConfig, activeChain } = useChain()

//   const fetchIdentities = async () => {
//     // Fetch identities for the provided addresses
//     const identities = await api?.query.identity.identityOf.multi(addresses)

//     if (!identities) {
//       return addresses.map((address) => {
//         return {
//           address,
//           identity: null,
//         }
//       })
//     }

//     // Map the results to the desired format
//     const result = addresses.map((address, index) => {
//       return {
//         address: address,
//         identity: identities[index].unwrapOr(null)?.toHuman(),
//       }
//     })

//     return result
//   }

//   return useQuery(
//     ['minNominatorBond', activeChain],
//     async () => fetchIdentities(),
//     {
//       enabled: !!api,
//     },
//   )
// }
