from azure.cosmos import CosmosClient, exceptions

# Configuration
url = 'https://edudb.documents.azure.com:443/'
key = 'vCMhO025Gj0SxDs32CGoixuGubQGmb9tnf8dtMDrECSSM8S7Gln6mSjxS2O4uAxKtytwvje31qjZACDbMdAvpA=='
database_name = 'userdb'
container_name = 'usercontainer1'

# Initialisation du client Cosmos DB
client = CosmosClient(url, credential=key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

def query_item(item_id):
    query = f"SELECT * FROM c WHERE c.id = '{item_id}'"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    for item in items:
        print(item)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python query_items.py item_id1 [item_id2 ...]")
        sys.exit(1)

    item_ids = sys.argv[1:]
    for item_id in item_ids:
        query_item(item_id)
