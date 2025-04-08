import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GroupActivityChart = ({onMaxGroupFound}) => {
 const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxMessageGroup, setMaxMessageGroup] = useState(null);
 
  useEffect(() => {
    const fetchGroupActivity = async () => {
      try {
        const token = localStorage.getItem('token_ulogovanog');
        
        if (!token) {
          setError("Nije pronađen token za autentikaciju");
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/group-activity', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("API Response:", response);

        if (!response.data || !Array.isArray(response.data)) {
          console.error("API nije vratio validne podatke:", response.data);
          setError("Nevalidan format podataka");
          setLoading(false);
          return;
        }

        // Transformisanje podataka za Recharts
        const formattedData = response.data.map(group => ({
          name: group.name || "Bez imena",
          poruke: parseInt(group.message_count) || 0,
          id: group.id
        }));

        if (formattedData.length > 0) {
            const maxGroup = formattedData.reduce((max, group) => 
              group.poruke > max.poruke ? group : max
            , formattedData[0]);
            
            setMaxMessageGroup(maxGroup);
            if (onMaxGroupFound) onMaxGroupFound(maxGroup);
            console.log("Grupa sa najvećim brojem poruka:", maxGroup);
          }
       
        console.log("Formatirani podaci:", formattedData);
        setActivityData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Greška pri dohvatanju aktivnosti grupa:", error);
        setError("Nije moguće učitati aktivnost grupa: " + (error.message || "Nepoznata greška"));
        setLoading(false);
      }
    };

    fetchGroupActivity();
  }, []);
 
 
  const getRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push('#' + Math.floor(Math.random()*16777215).toString(16));
    }
    return colors;
  };
  
  const barColors = activityData.length > 0 ? getRandomColors(activityData.length) : ['#3366CC'];

  if (loading) {
    return (
      <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        <CardHeader title="Učitavanje aktivnosti grupa" />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        <CardHeader title="Greška" />
        <CardContent>
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (activityData.length === 0) {
    return (
      <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        <CardHeader title="Aktivnost Grupa" subheader="Broj poruka po grupama" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" align="center">
            Nema podataka o aktivnosti grupa
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ width: '100%', margin: 'auto', textAlign:'center', overflow:'hidden'}}>
      <CardHeader 
        title="Aktivnost Grupa" 
        subheader="Broj poruka po grupama" 
        
      />
      <CardContent >
        <Box sx={{ width: '100%', height: 328 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={50}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Broj poruka', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value, name) => [`${value} poruka`, 'Aktivnost']} />
              <Bar 
                dataKey="poruke" 
                name="Broj poruka" 
                fill="#3366CC"
                radius={[5, 5, 0, 0]} 
                >
                {
                 activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))
                }
                </Bar>
              
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};



export default GroupActivityChart;
