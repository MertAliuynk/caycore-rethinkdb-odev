document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('item-form');
  const itemNameInput = document.getElementById('item-name');
  const itemList = document.getElementById('items-list');
  let isEditing = false;
  let currentItemId = null;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const itemName = itemNameInput.value;

    if (isEditing) {
      updateItem({ name: itemName }, currentItemId);
    } else {
      addItem({ name: itemName });
    }

    form.reset();
    isEditing = false;
    currentItemId = null;
  });

  function addItem(item) {
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(() => fetchItems());
  }
  
  function fetchItems() {
    fetch('/api/items')
      .then(response => response.json())
      .then(data => {
        itemList.innerHTML = '';
        data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.name;

          const updateBtn = document.createElement('button');
          updateBtn.textContent = 'Update';
          updateBtn.onclick = () => editItem(item);

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.onclick = () => deleteItem(item.id);

          li.appendChild(updateBtn);
          li.appendChild(deleteBtn);
          itemList.appendChild(li);
        });
      });
  }

  function editItem(item) {
    isEditing = true;
    currentItemId = item.id;
    itemNameInput.value = item.name;
  }

  function updateItem(updatedItem, id) {
    fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItem)
    })
    .then(response => response.json())
    .then(() => fetchItems());
  }

  function deleteItem(id) {
    fetch(`/api/items/${id}`, { method: 'DELETE' })
      .then(() => fetchItems());
  }

  fetchItems();
});
