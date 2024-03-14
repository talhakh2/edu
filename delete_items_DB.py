from azure.cosmos import CosmosClient, exceptions

url = 'https://edudb.documents.azure.com:443/'
key = 'vCMhO025Gj0SxDs32CGoixuGubQGmb9tnf8dtMDrECSSM8S7Gln6mSjxS2O4uAxKtytwvje31qjZACDbMdAvpA=='
database_name = 'userdb'
container_name = 'usercontainer1'
partition_key = '/userid'

client = CosmosClient(url, credential=key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

def delete_item(item_id, partition_key):
    try:
        container.delete_item(item=item_id, partition_key=partition_key)
        print(f'Item with id {item_id} has been deleted.')
    except exceptions.CosmosHttpResponseError as e:
        print(f'Failed to delete item: {e}')

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 delete_items.py item_id1 [item_id2 ...]")
        sys.exit(1)

    item_ids = sys.argv[1:]
    for item_id in item_ids:
        delete_item(item_id, partition_key)
