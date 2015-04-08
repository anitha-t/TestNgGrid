json.currentPage @pageNo.to_i
json.pageSize @pageSize
json.totalRecords @total

json.employees do |employeeElement|
  employeeElement.array!(@employees) do |employee|
    json.extract! employee, :id, :name, :age, :surname
  end
end	