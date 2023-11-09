const { push, ref } = 'firebase/database';
const db = 'element.js';

// Reference to the location in your database where you want to add new data.
const databaseRef = ref(db, 'https://accessibility-bus-default-rtdb.asia-southeast1.firebasedatabase.app/"Customer_info"');

// Data to push to the database.
const newData = {
    "customers": {
        "customer1": {
          "name": "สุรชัย รักสีดา",
          "email": "suraichai@example.com",
          "phone": "081-234-5678",
          "address": "123 ถนนเพชรบุรี แขวงราชดำริ เขตบางกอกใหญ่, กรุงเทพมหานคร",
          "disabilityType": "กายภาพ",
          "assistanceNeeded": "ระบบช่วยเดิน",
          "created_at": "2023-11-09T12:00:00Z"
        },
        "customer2": {
          "name": "ณรา รัตนานุกิจ",
          "email": "nara@example.com",
          "phone": "089-876-5432",
          "address": "456 ถนนราชดำริ แขวงลาดพร้าว เขตบางกอกใหญ่, กรุงเทพมหานคร",
          "disabilityType": "ทางสายตา",
          "assistanceNeeded": "รถยนต์ส่วนบุคคล",
          "created_at": "2023-11-09T12:15:00Z"
        },
        "customer3": {
          "name": "วรินทร พานชาติ",
          "email": "vorin@example.com",
          "phone": "086-123-4567",
          "address": "789 ถนนพระรามเก้า แขวงสีลม เขตบางรัก, กรุงเทพมหานคร",
          "disabilityType": "การได้ยิน",
          "assistanceNeeded": "อุปกรณ์ช่วยฟัง",
          "created_at": "2023-11-09T12:30:00Z"
        },
        "customer4": {
          "name": "ศรีลักษณ์ วชิรศรี",
          "email": "silak@example.com",
          "phone": "082-345-6789",
          "address": "101 ถนนสาทร แขวงทุ่งมหาเมฆ เขตสาทร, กรุงเทพมหานคร",
          "disabilityType": "สมอง",
          "assistanceNeeded": "การดูแลสุขภาพ",
          "created_at": "2023-11-09T12:45:00Z"
        },
        "customer5": {
          "name": "อรทัย บุรีทุน",
          "email": "orathai@example.com",
          "phone": "083-987-6543",
          "address": "222 ถนนอิสรานอามหานาค แขวงหางมัสลิน เขตพระนคร, กรุงเทพมหานคร",
          "disabilityType": "ระบบประสาท",
          "assistanceNeeded": "กายภาพบำบัด",
          "created_at": "2023-11-09T13:00:00Z"
        },
        "customer6": {
          "name": "วรากร บุญรัตน์",
          "email": "warakorn@example.com",
          "phone": "088-765-4321",
          "address": "333 ถนนราชวรรณรังสิต แขวงทุ่งวัดเทพเจดีย์ เขตป้อมปราบศัตรูพ่าย, กรุงเทพมหานคร",
          "disabilityType": "การได้ยิน",
          "assistanceNeeded": "ช่วยเดิน",
          "created_at": "2023-11-09T13:15:00Z"
        },
        "customer7": {
          "name": "นภาพร ชัยวิวัฒนา",
          "email": "napaporn@example.com",
          "phone": "080-654-3210",
          "address": "444 ถนนสายไหม แขวงบางนา เขตบางนา, กรุงเทพมหานคร",
          "disabilityType": "ทางสายตา",
          "assistanceNeeded": "รถยนต์ส่วนบุคคล",
          "created_at": "2023-11-09T13:30:00Z"
        },
        "customer8": {
          "name": "สุภาภรณ์ สุนพรรณ",
          "email": "supaporn@example.com",
          "phone": "084-321-6547",
          "address": "555 ถนนสีลม แขวงสีลม เขตบางรัก, กรุงเทพมหานคร",
          "disabilityType": "กายภาพ",
          "assistanceNeeded": "ระบบช่วยเดิน",
          "created_at": "2023-11-09T13:45:00Z"
        },
        "customer9": {
          "name": "ปรียะวุฒิ วิภาวิชา",
          "email": "priyawut@example.com",
          "phone": "087-543-2167",
          "address": "666 ถนนราชวรรณรังสิต แขวงทุ่งวัดเทพเจดีย์ เขตป้อมปราบศัตรูพ่าย, กรุงเทพมหานคร",
          "disabilityType": "ระบบประสาท",
          "assistanceNeeded": "กายภาพบำบัด",
          "created_at": "2023-11-09T14:00:00Z"
        },
        "customer10": {
          "name": "จิรเดช อินทร์ทรรศ",
          "email": "jiradet@example.com",
          "phone": "085-432-1654",
          "address": "777 ถนนสายไหม แขวงบางนา เขตบางนา, กรุงเทพมหานคร",
          "disabilityType": "ทางสายตา",
          "assistanceNeeded": "ระบบช่วยเดิน",
          "created_at": "2023-11-09T14:15:00Z"
        }
      }
};

// Push the new data to the Realtime Database.
const newRecordRef = push(databaseRef, newData);

console.log('Data pushed successfully with key: ', newRecordRef.key);
