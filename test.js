const jsonObject=
[
   {
      studentId:101,
      studentName:"David"
   },
   {
      studentId:102,
      studentName:"Mike"
   },
   {
      studentId:103,
      studentName:"David"
   },
   {
      studentId:104,
      studentName:"Bob"
   }
]
var result=jsonObject.filter(obj=> obj.studentName == "David");
console.log(result);