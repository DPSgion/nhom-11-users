import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('hoten')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('table')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://6a830a1ecb486d2434033464.mockapi.io/nguoidung')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setFilteredUsers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...users]

    if (search.trim() !== '') {
      result = result.filter(user =>
        user.hoten.toLowerCase().includes(search.toLowerCase())
      )
    }

    result.sort((a, b) => {
      let valueA = a[sortField] || ''
      let valueB = b[sortField] || ''

      if (sortField === 'id') {
        valueA = Number(valueA)
        valueB = Number(valueB)
      } else {
        valueA = valueA.toString().toLowerCase()
        valueB = valueB.toString().toLowerCase()
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredUsers(result)
  }, [search, sortField, sortOrder, users])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return '';
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Quản lý Người dùng</h1>
        <div className="group-info">
          <div className="info-row">
            <span className="info-label">Nhóm</span>
            <span className="info-value">Nhóm 11 - Bài tập Frontend</span>
          </div>
          <div className="info-row">
            <span className="info-label">Thành viên</span>
            <span className="info-value">Khương Thị Trúc My, Nguyễn Trần Công Minh</span>
          </div>
          <div className="info-row">
            <span className="info-label">Lớp</span>
            <span className="info-value"></span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="sort-buttons">
          <button onClick={() => handleSort('hoten')}>
            Tên {getSortIcon('hoten')}
          </button>
          <button onClick={() => handleSort('quocgia')}>
            Quốc gia {getSortIcon('quocgia')}
          </button>
          <button onClick={() => handleSort('id')}>
            ID {getSortIcon('id')}
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty">Không tìm thấy người dùng nào phù hợp.</div>
      ) : viewMode === 'table' ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Địa chỉ</th>
                <th>Quốc gia</th>
                <th>Số điện thoại</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.hoten}</td>
                  <td>{user.diachi}</td>
                  <td>{user.quocgia}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid">
          {filteredUsers.map(user => (
            <div className="card" key={user.id}>
              <h3>{user.hoten}</h3>
              <p><strong>ID:</strong> <span>#{user.id}</span></p>
              <p><strong>Địa chỉ:</strong> <span>{user.diachi}</span></p>
              <p><strong>Quốc gia:</strong> <span>{user.quocgia}</span></p>
              <p><strong>SĐT:</strong> <span>{user.phone}</span></p>
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        <p>Hiển thị <strong>{filteredUsers.length}</strong> người dùng trong hệ thống</p>
      </footer>
    </div>
  )
}

export default App