# Rutki:


Host: https://januszeapi.herokuapp.com/api/

### **GET** /users

Response codes:
```
200 - OK
500 - INTERNAL SEVER ERROR
```

Response body:
```
[
    {
        _id: String,
        password: String,
        login: String
        created: String
    }
]
```

### **GET** /users/{id}

Response codes:
```
200 - OK
404 - USER NOT FOUND
500 - INTERNAL SEVER ERROR
```

Response body:
```
{
    _id: String,
    password: String,
    login: String
    created: String
}
```

### **POST** /users

Response codes:
```
200 - USER CREATED
400 - VALIDATION ERRORS
409 - USER ALREDY EXISTS
500 - INTERNAL SEVER ERROR
```

Response body:
```
{
    _id: String,
    password: String,
    login: String
    created: String
}
```
