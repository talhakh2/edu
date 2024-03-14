from azure.cosmos import CosmosClient, PartitionKey
import json
import bcrypt
import logging

endpoint = "https://edudb.documents.azure.com:443/"
key = 'vCMhO025Gj0SxDs32CGoixuGubQGmb9tnf8dtMDrECSSM8S7Gln6mSjxS2O4uAxKtytwvje31qjZACDbMdAvpA=='
client = CosmosClient(endpoint, key)

logging.basicConfig(filename='cosmosdb_operations.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

database_name = 'userdb'
container_name = 'usercontainer1'
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed

with open('test-loadDB.json', 'r') as file:
    users = json.load(file)

for user in users:
    user['password'] = hash_password(user['password']).decode('utf-8')
    response = container.upsert_item(user)
    logging.info(f"Inserted item with id {response['id']}")

print("Data imported successfully.")
