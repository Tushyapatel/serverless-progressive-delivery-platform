import matplotlib.pyplot as plt

# Data
labels = ["Rent", "Food", "Travel", "Savings"]
values = [25000, 12000, 5000, 8000]

# Explode one item
explode = [0, 0.2, 0, 0]

# Pie chart
plt.pie(
    values,
    labels=labels,
    explode=explode,
    autopct='%1.1f%%'
)

# Title
plt.title("Monthly Expenses")

# Legend with title
plt.legend(
   
    title="Expense Type"
)

# Show chart
plt.show()