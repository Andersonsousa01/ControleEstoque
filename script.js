import React, { useState, useEffect, useMemo } from 'react';
import { Package, AlertTriangle, TrendingUp, Users, ShoppingCart, Plus, Edit, Trash2, Search, Calendar, DollarSign, BarChart3, Home, Settings, Bell } from 'lucide-react';

const { useStoredState } = hatch;

const VitaVinhoSystem = () => {
  const [activeTab, setActiveTab] = useStoredState('activeTab', 'dashboard');
  const [produtos, setProdutos] = useStoredState('produtos', []);
  const [fornecedores, setFornecedores] = useStoredState('fornecedores', []);
  const [movimentacoes, setMovimentacoes] = useStoredState('movimentacoes', []);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [systemName, setSystemName] = useStoredState('systemName', 'AdegaMax');
  const [systemDescription, setSystemDescription] = useStoredState('systemDescription', 'Sistema de Gestão de Adega de Bebidas');

  // Dados iniciais de exemplo
  useEffect(() => {
    if (produtos.length === 0) {
      setProdutos([
        {
          id: 1,
          nome: 'Vinho Tinto Cabernet',
          codigo: 'VT001',
          categoria: 'Vinhos',
          estoque: 15,
          estoqueMinimo: 10,
          valorCompra: 45.00,
          margemLucro: 40,
          valorVenda: 63.00,
          validade: '2025-12-15',
          fornecedorId: 1,
          status: 'ativo'
        },
        {
          id: 2,
          nome: 'Cerveja Premium Lager',
          codigo: 'CP002',
          categoria: 'Cervejas',
          estoque: 5,
          estoqueMinimo: 20,
          valorCompra: 8.50,
          margemLucro: 35,
          valorVenda: 11.48,
          validade: '2025-08-20',
          fornecedorId: 2,
          status: 'ativo'
        },
        {
          id: 3,
          nome: 'Whisky Single Malt',
          codigo: 'WS003',
          categoria: 'Destilados',
          estoque: 3,
          estoqueMinimo: 5,
          valorCompra: 180.00,
          margemLucro: 50,
          valorVenda: 270.00,
          validade: '2027-01-10',
          fornecedorId: 1,
          status: 'ativo'
        }
      ]);
    }

    if (fornecedores.length === 0) {
      setFornecedores([
        {
          id: 1,
          nome: 'Vinícola Premium Ltda',
          contato: 'João Silva',
          telefone: '(11) 99999-9999',
          email: 'contato@vinicola.com.br',
          endereco: 'Rua das Vinhas, 123',
          categoria: 'Vinhos e Destilados',
          status: 'ativo'
        },
        {
          id: 2,
          nome: 'Cervejaria Artesanal',
          contato: 'Maria Santos',
          telefone: '(11) 88888-8888',
          email: 'vendas@cervejaria.com.br',
          endereco: 'Av. do Malte, 456',
          categoria: 'Cervejas',
          status: 'ativo'
        }
      ]);
    }
  }, []);

  // Calculadora de preço de venda
  const calcularPrecoVenda = (valorCompra, margem) => {
    return valorCompra * (1 + margem / 100);
  };

  // Filtros e alertas
  const produtosComEstoqueBaixo = useMemo(() => {
    return produtos.filter(p => p.estoque <= p.estoqueMinimo);
  }, [produtos]);

  const produtosProximosVencimento = useMemo(() => {
    const hoje = new Date();
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return produtos.filter(p => {
      const dataVencimento = new Date(p.validade);
      return dataVencimento <= em30Dias && dataVencimento > hoje;
    });
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produtos, searchTerm]);

  // Handlers
  const handleSaveProduto = (produto) => {
    if (editingItem) {
      setProdutos(produtos.map(p => p.id === editingItem.id ? { ...produto, id: editingItem.id } : p));
    } else {
      setProdutos([...produtos, { ...produto, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveFornecedor = (fornecedor) => {
    if (editingItem) {
      setFornecedores(fornecedores.map(f => f.id === editingItem.id ? { ...fornecedor, id: editingItem.id } : f));
    } else {
      setFornecedores([...fornecedores, { ...fornecedor, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id, type) => {
    if (type === 'produto') {
      setProdutos(produtos.filter(p => p.id !== id));
    } else if (type === 'fornecedor') {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const getFornecedorNome = (fornecedorId) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nome : 'Não encontrado';
  };

  // Componente Modal
  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Formulário de Produto
  const ProdutoForm = () => {
    const [form, setForm] = useState(editingItem || {
      nome: '', codigo: '', categoria: '', estoque: 0, estoqueMinimo: 0,
      valorCompra: 0, margemLucro: 0, validade: '', fornecedorId: '', status: 'ativo'
    });

    const valorVenda = calcularPrecoVenda(form.valorCompra, form.margemLucro);

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSaveProduto({ ...form, valorVenda });
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <select
            value={form.fornecedorId}
            onChange={(e) => setForm({ ...form, fornecedorId: parseInt(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Selecione o Fornecedor</option>
            {fornecedores.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Estoque Atual"
            value={form.estoque}
            onChange={(e) => setForm({ ...form, estoque: parseInt(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Estoque Mínimo"
            value={form.estoqueMinimo}
            onChange={(e) => setForm({ ...form, estoqueMinimo: parseInt(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="date"
            value={form.validade}
            onChange={(e) => setForm({ ...form, validade: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            step="0.01"
            placeholder="Valor de Compra"
            value={form.valorCompra}
            onChange={(e) => setForm({ ...form, valorCompra: parseFloat(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Margem de Lucro (%)"
            value={form.margemLucro}
            onChange={(e) => setForm({ ...form, margemLucro: parseFloat(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor de Venda"
            value={valorVenda.toFixed(2)}
            className="border rounded px-3 py-2 bg-gray-100"
            readOnly
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Salvar
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  // Formulário de Fornecedor
  const FornecedorForm = () => {
    const [form, setForm] = useState(editingItem || {
      nome: '', contato: '', telefone: '', email: '', endereco: '', categoria: '', status: 'ativo'
    });

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSaveFornecedor(form);
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome do Fornecedor"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Contato"
            value={form.contato}
            onChange={(e) => setForm({ ...form, contato: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Endereço"
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Categoria de Produtos"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Salvar
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">{systemName}</h1>
              <p className="text-sm opacity-90">{systemDescription}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 cursor-pointer" />
              {(produtosComEstoqueBaixo.length > 0 || produtosProximosVencimento.length > 0) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {produtosComEstoqueBaixo.length + produtosProximosVencimento.length}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Anderson Sousa</p>
              <p className="text-xs opacity-75">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'produtos', label: 'Produtos', icon: Package },
                { id: 'fornecedores', label: 'Fornecedores', icon: Users },
                { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
                { id: 'configuracoes', label: 'Configurações', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <div className="text-sm text-gray-600">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </div>
              </div>

              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Produtos</p>
                      <p className="text-2xl font-bold text-blue-600">{produtos.length}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Estoque Baixo</p>
                      <p className="text-2xl font-bold text-red-600">{produtosComEstoqueBaixo.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Próx. Vencimento</p>
                      <p className="text-2xl font-bold text-yellow-600">{produtosProximosVencimento.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Fornecedores</p>
                      <p className="text-2xl font-bold text-green-600">{fornecedores.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Alertas */}
              {(produtosComEstoqueBaixo.length > 0 || produtosProximosVencimento.length > 0) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    Alertas Importantes
                  </h3>
                  
                  {produtosComEstoqueBaixo.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-600 mb-2">Produtos com Estoque Baixo:</h4>
                      <div className="space-y-2">
                        {produtosComEstoqueBaixo.map(produto => (
                          <div key={produto.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium">{produto.nome}</p>
                              <p className="text-sm text-gray-600">Estoque: {produto.estoque} | Mínimo: {produto.estoqueMinimo}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">Fornecedor:</p>
                              <p className="text-sm text-gray-600">{getFornecedorNome(produto.fornecedorId)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {produtosProximosVencimento.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Produtos Próximos ao Vencimento:</h4>
                      <div className="space-y-2">
                        {produtosProximosVencimento.map(produto => (
                          <div key={produto.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="font-medium">{produto.nome}</p>
                              <p className="text-sm text-gray-600">Vencimento: {new Date(produto.validade).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">Fornecedor:</p>
                              <p className="text-sm text-gray-600">{getFornecedorNome(produto.fornecedorId)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Produtos */}
          {activeTab === 'produtos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Gestão de Produtos</h2>
                <button
                  onClick={() => {
                    setModalType('produto');
                    setEditingItem(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Produto</span>
                </button>
              </div>

              {/* Busca */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tabela de Produtos */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valores</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {produtosFiltrados.map(produto => (
                        <tr key={produto.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                              <div className="text-sm text-gray-500">{produto.codigo} | {produto.categoria}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                produto.estoque <= produto.estoqueMinimo
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {produto.estoque}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">/ {produto.estoqueMinimo}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div>Compra: R$ {produto.valorCompra.toFixed(2)}</div>
                              <div>Venda: R$ {produto.valorVenda.toFixed(2)}</div>
                              <div className="text-xs text-green-600">Margem: {produto.margemLucro}%</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(produto.validade).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getFornecedorNome(produto.fornecedorId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(produto);
                                  setModalType('produto');
                                  setShowModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(produto.id, 'produto')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Fornecedores */}
          {activeTab === 'fornecedores' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Gestão de Fornecedores</h2>
                <button
                  onClick={() => {
                    setModalType('fornecedor');
                    setEditingItem(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Fornecedor</span>
                </button>
              </div>

              {/* Tabela de Fornecedores */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fornecedores.map(fornecedor => {
                        const produtosFornecedor = produtos.filter(p => p.fornecedorId === fornecedor.id);
                        return (
                          <tr key={fornecedor.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{fornecedor.nome}</div>
                                <div className="text-sm text-gray-500">{fornecedor.endereco}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                <div>{fornecedor.contato}</div>
                                <div className="text-xs text-gray-500">{fornecedor.telefone}</div>
                                <div className="text-xs text-gray-500">{fornecedor.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fornecedor.categoria}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {produtosFornecedor.length} produtos
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingItem(fornecedor);
                                    setModalType('fornecedor');
                                    setShowModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(fornecedor.id, 'fornecedor')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Relatórios */}
          {activeTab === 'relatorios' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Relatórios e Análises</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Produtos por Categoria</h3>
                  <div className="space-y-2">
                    {Object.entries(
                      produtos.reduce((acc, produto) => {
                        acc[produto.categoria] = (acc[produto.categoria] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([categoria, count]) => (
                      <div key={categoria} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{categoria}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Valor Total do Estoque</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor de Compra</span>
                      <span className="font-medium">
                        R$ {produtos.reduce((acc, p) => acc + (p.valorCompra * p.estoque), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor de Venda</span>
                      <span className="font-medium">
                        R$ {produtos.reduce((acc, p) => acc + (p.valorVenda * p.estoque), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Margem de Lucro</span>
                      <span className="font-medium text-green-600">
                        R$ {(produtos.reduce((acc, p) => acc + (p.valorVenda * p.estoque), 0) - 
                             produtos.reduce((acc, p) => acc + (p.valorCompra * p.estoque), 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configurações */}
          {activeTab === 'configuracoes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Configurações</h2>
              
              {/* Configurações do Sistema */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Configurações do Sistema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Sistema
                    </label>
                    <input
                      type="text"
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                      className="border rounded px-3 py-2 w-full max-w-md"
                      placeholder="Digite o nome do seu sistema"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição do Sistema
                    </label>
                    <input
                      type="text"
                      value={systemDescription}
                      onChange={(e) => setSystemDescription(e.target.value)}
                      className="border rounded px-3 py-2 w-full max-w-md"
                      placeholder="Digite a descrição do seu sistema"
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-4">
                      Pré-visualização: <strong>{systemName}</strong> - {systemDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Configurações Gerais */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dias para Alerta de Vencimento
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="border rounded px-3 py-2 w-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margem de Lucro Padrão (%)
                    </label>
                    <input
                      type="number"
                      defaultValue={35}
                      className="border rounded px-3 py-2 w-32"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Salvar Configurações
                  </button>
                </div>
              </div>

              {/* Configurações Rápidas */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Configurações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setSystemName('AdegaMax');
                      setSystemDescription('Sistema de Gestão de Adega de Bebidas');
                    }}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">AdegaMax</div>
                    <div className="text-sm text-gray-600">Para adegas de bebidas em geral</div>
                  </button>
                  <button 
                    onClick={() => {
                      setSystemName('VitaVinho');
                      setSystemDescription('Sistema de Gestão Premium para Distribuidoras');
                    }}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">VitaVinho</div>
                    <div className="text-sm text-gray-600">Para distribuidoras de vinhos</div>
                  </button>
                  <button 
                    onClick={() => {
                      setSystemName('BrewStock');
                      setSystemDescription('Sistema de Gestão para Cervejarias');
                    }}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">BrewStock</div>
                    <div className="text-sm text-gray-600">Para cervejarias e bares</div>
                  </button>
                  <button 
                    onClick={() => {
                      setSystemName('BebidaStock');
                      setSystemDescription('Sistema de Controle de Estoque de Bebidas');
                    }}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">BebidaStock</div>
                    <div className="text-sm text-gray-600">Para controle geral de bebidas</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title={modalType === 'produto' ? 'Produto' : 'Fornecedor'}
          onClose={() => setShowModal(false)}
        >
          {modalType === 'produto' ? <ProdutoForm /> : <FornecedorForm />}
        </Modal>
      )}
    </div>
  );
};

export default VitaVinhoSystem;
