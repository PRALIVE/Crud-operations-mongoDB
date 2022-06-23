# Crud-operations-mongoDB

It is a simple node app having a simple UI using ejs templates .

In this app you can add a data and then save it to a list.

You have update button where you can edit the details and update the list.

Using Delete button you can delete that user from the list.

There is also an option of SEND EMAIL . In this you can first select the users by checking the checkbox and then click
on SEND EMAIL button it will automatically send the selected users information to the receiver as mentioned in the code(You can change sender and receiver)

#how to use
>   npm install

   
this will install all dependencies

> mongoose.connect("mongodb+srv:///<username>:<password>@cluster0.m6vkv3c.mongodb.net/<DBname>")
  
put your username and password from mongoDb atlas . Then give a name to your database in <DBname>
  
> user: process.env.user,
> pass: process.env.pass
  
 insert your email in user and password in pass as per your gmail acoount
  
 > from: '"Pankaj" <pankajpcm111@gmail.com>', // sender address
 > to: '<info@redpositive.in>', // list of receivers
 > subject: 'Selected Users Data', // Subject line
 > text: 'hello', // plain text body
  
 Change then according to your requirement.
  
  And now you are ready to make this your own.
  Run this command in your terminal
 > node app.js
  


