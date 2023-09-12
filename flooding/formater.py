import json

# Función para formatear el JSON con comillas dobles y guardar en el mismo archivo
def format_json_and_save(file_name):
    try:
        with open(file_name, 'r') as file:
            # Lee el contenido del archivo y reemplaza comillas simples por comillas dobles
            json_str = file.read().replace("'", '"')

            # Cargar el JSON en un diccionario de Python
            data = json.loads(json_str)

            # Formatear el JSON con comillas dobles e indentación
            formatted_json = json.dumps(data, indent=2)

            # Guardar el JSON formateado en el mismo archivo
            with open(file_name, 'w') as output_file:
                output_file.write(formatted_json)

            print(f"Archivo '{file_name}' formateado y guardado exitosamente.")
    except FileNotFoundError:
        print(f"El archivo '{file_name}' no se encontró en la carpeta actual.")

# Nombre de los archivos a formatear y guardar
file_names = [
    'names1-x-randomX-2023.txt', 
    'topo1-x-randomX-2023.txt'
]

# Formatear y guardar cada archivo
for file_name in file_names:
    format_json_and_save(file_name)
