let db = {
    users: [
        {
            userId: 'dh23ggj5h32g543j5gf43',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-03-15T10:59:52.798Z',
            imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Lonodn, UK'
        }
    ],
    screams: [
        {
            handle: 'user',
            body: 'This is a sample scream',
            createdAt: '2019-03-15T10:59:52.798Z',
            likeCount: 5,
            commentCount: 3
        }
    ],
    comments: [
        {
            handle: 'user',
            screamId: 'kdjsfgdksuufhgkdsufky',
            body: 'nice one mate!',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            screamId: 'kdjsfgdksuufhgkdsufky',
            type: 'like | comment',
            createdAt: '2019-03-15T10:59:52.798Z'
        }
    ],
    likes: [
        {
            userId: '2jlkdjahdgasdjfgksjdg',
            commentId: 'sjkkldfau34oi5hghdklga'
        }
    ]
};
const userDetails = {
    // Redux data
    credentials: {
        userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'Lonodn, UK'
    },
    likes: [
        {
            handle: 'user',
            screamId: 'hh7O5oWfWucVzGbHH2pa'
        },
        {
            handle: 'user',
            screamId: '3IOnFoQexRcofs5OhBXO'
        }
    ]
};


const userToken = [
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMDM2YWYyZDgzOWE4NDJhZjQzY2VjZmJiZDU4YWYxYTc1OGVlYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLW1lZGlhLWFwcC0yODc1MTIiLCJhdWQiOiJzb2NpYWwtbWVkaWEtYXBwLTI4NzUxMiIsImF1dGhfdGltZSI6MTU5ODg0NDAyNywidXNlcl9pZCI6ImlQWXNDaVhvbmlYbXRvenJvYnNpZ0lxYXk3YjIiLCJzdWIiOiJpUFlzQ2lYb25pWG10b3pyb2JzaWdJcWF5N2IyIiwiaWF0IjoxNTk4ODQ0MDI3LCJleHAiOjE1OTg4NDc2MjcsImVtYWlsIjoicGV0ZXIyQGVtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwZXRlcjJAZW1haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.WdsIWt6H_Q_G822oOVcfzfsYxehE2CGFG4E37niulYo41PTy418XmQd5WrhAbP1y5LfQm9KQwwrc_4kUC05DfnrRp-GGI9DoImbFHqt4iVASBFZAfEAJvFWLByHo5YwERtL9cnCcbzDWBWL-_UPWLsOdB9fVwIzUguvnc2keZ2MeJo9vvqzKO4zVk4WGuexaTKVocWmGVDn9PUtpY6FTk01GqzfAhkD1BjUTpFeyHyI13dNjt8UZDVeqbMe0vI4tYkDJSfvmuvIjhCXo8Cvk8EDb8EL4t1Ukv50A9l3zt0WhWjd1TLmOq9l848e2QmkoPI47W7ptNJdsABSE0pd8bg",

    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMDM2YWYyZDgzOWE4NDJhZjQzY2VjZmJiZDU4YWYxYTc1OGVlYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLW1lZGlhLWFwcC0yODc1MTIiLCJhdWQiOiJzb2NpYWwtbWVkaWEtYXBwLTI4NzUxMiIsImF1dGhfdGltZSI6MTU5ODg0NDYyNSwidXNlcl9pZCI6InYxM3FhRXNMNlNmUmt5TFJMUVJIajkyYnBxRzIiLCJzdWIiOiJ2MTNxYUVzTDZTZlJreUxSTFFSSGo5MmJwcUcyIiwiaWF0IjoxNTk4ODQ0NjI1LCJleHAiOjE1OTg4NDgyMjUsImVtYWlsIjoicGV0ZXIyc0BlbWFpbC5jb21zIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInBldGVyMnNAZW1haWwuY29tcyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.rX9zY15tc23TSTIUy-dlFa-0NEY93I-eaqeRf0VclpDFU9JgG_T_zQawZrxofSMdvRof0ZMKff96ioHg7nzQohXOLm2EdHcoTMEU2X7YW4NMHCgWQyhjGtVEmla3NCfElHVHf4duLfDH8fwFqOwasps6oTQu-aIqTspdABpiJaZYImuqdr_tQsVmtvJ_OUHlPFJVeixotkXFzvxbor1SOjtaMfq_qIDkFDNpBtDzxnXPwqzHlS6JDut648rNqaP4eyYVrNKwrIJ4nCMZUnkt1sGl_O54NKKcV0XKypwWyUQP64JM9G5ugezDiFhBbUmQ7e9-JpTdMTmcQpm2LRQPZw',

    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMDM2YWYyZDgzOWE4NDJhZjQzY2VjZmJiZDU4YWYxYTc1OGVlYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLW1lZGlhLWFwcC0yODc1MTIiLCJhdWQiOiJzb2NpYWwtbWVkaWEtYXBwLTI4NzUxMiIsImF1dGhfdGltZSI6MTU5ODg0NTkzNCwidXNlcl9pZCI6Ik1OUE1kSUpsV2lWTTZqQXpYT1BFQlVlTWdneDIiLCJzdWIiOiJNTlBNZElKbFdpVk02akF6WE9QRUJVZU1nZ3gyIiwiaWF0IjoxNTk4ODQ1OTM0LCJleHAiOjE1OTg4NDk1MzQsImVtYWlsIjoicGV0ZXIyc0BlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicGV0ZXIyc0BlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.GVCm0UfAYiCdxn815E_iPOHTLfjrf4qqaWK9p9hWwsswuc6ptfMtxOzaK8m_T7Vm9OW3lbGqy0vCa9tua3yJhtAQFsryJYzBAKyDczeX_TIaV2RadA5qWV2pPydfbIJ78zdQgUXdP2cYy2C1mhFcCz77zZ2EhqZP6ae5FP0aa2-BawaAsSwaOfSY9_AABiVZ5UppXu7aZZvXNAUG-UnIxGynzVcpATWi4itLq5TgZRsTXvDPvsPWCNZh-iSDc0P2kqJad7QAieQ0VEiRywQKSbvQQMT2PrYB68GoUjGEb1U-Xe6dxgAM00_4gtd7-vX3GF351f5iQ8H18xM5JxNypg',

    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUxMDM2YWYyZDgzOWE4NDJhZjQzY2VjZmJiZDU4YWYxYTc1OGVlYTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLW1lZGlhLWFwcC0yODc1MTIiLCJhdWQiOiJzb2NpYWwtbWVkaWEtYXBwLTI4NzUxMiIsImF1dGhfdGltZSI6MTU5ODg0NjEzMiwidXNlcl9pZCI6IjNZWlAzUk01UWdOcHVLbUUwSjMyRjFkdXFrdzIiLCJzdWIiOiIzWVpQM1JNNVFnTnB1S21FMEozMkYxZHVxa3cyIiwiaWF0IjoxNTk4ODQ2MTMyLCJleHAiOjE1OTg4NDk3MzIsImVtYWlsIjoicGV0ZXIyNEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicGV0ZXIyNEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.psrdj3XMvvcznsRFS7sYQL_RVdObIRE7aUcsnh-Ag7THPVXT5HnzJn9CYQ225zmIXzYrCZycJEa3lPifereCFisBQDJhOy-yp9feTZbMNzHeeoYAk5_6rAGmi8qxw_xETbbKmTbqYy2AcmWktPnuTqQakfQxqTm8nD1BjohxaS3zDz-25emJ5wG0hgo5HeVuvU_BpD9S4j764n3l0LVOLTlB9W8yXyEZQMAqk7gPgaycqaZZAr4gTdpp3MIVeBDvua6sR7yVmBDy2eRRhQ_Gw1YpVMml0NFgZbxB6nefxXx-_NJmbsIbkMm9NeCgT8aUvYj_OSSrYzQttp_h0yuNYQ'
]