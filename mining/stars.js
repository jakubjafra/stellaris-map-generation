module.exports = function(raw){
    let data = {
        stars: {},
        planets: {},
        empires: {}
    };

    Object
        .keys(raw.galactic_object)
        .forEach(i => {
            const o = raw.galactic_object[i];

            let planets = o.planet;
            if(planets === null)
                planets = [];
            if(!Array.isArray(planets))
                planets = [ planets ];

            data.stars[o.name] = {
                cords: {
                    x: o.coordinate.x,
                    y: o.coordinate.y
                },
                type: o.type,
                name: o.name,
                planets: planets.map(pId => `${pId}`)
            };
        });

    Object
        .keys(raw.planet)
        .forEach(i => {
            const o = raw.planet[i];

            let planet = {
                colonized: false
            };

            if(o.pop !== undefined){
                planet.colonized = true;
                planet.populationCount = o.pop.length;
            }

            data.planets[i] = planet;
        });

    Object
        .keys(raw.country)
        .forEach(i => {
            const o = raw.country[i];

            data.empires[i] = {
                type: o.type,
                color: o.flag !== undefined ? o.flag.colors[0] : undefined
            };

            if(o.type !== "primitive" && o.owned_planets !== undefined) {
                o.owned_planets.forEach(planetId => {
                    data.planets[planetId].controlledBy = i;
                });
            }
        });

    data.stars = Object
        .keys(data.stars)
        .map(i => {
            let star = data.stars[i];

            // find who is in control of system - eq. who is in control of planets in system
            star.influencedBy = star.planets
                // map with controlled planets by empires
                .map(planetId => data.planets[planetId])
                .filter(planet => !!planet.controlledBy)
                .filter(planet => { return { controlledBy: planet.controlledBy, populationCount: planet.populationCount }; })
                // remove duplicates:
                .sort((a, b) => b.populationCount - a.populationCount)
                .filter((item, pos, ary) => !pos || item.controlledBy != ary[pos - 1].controlledBy);

            return star;
        })
        .reduce((prev, curr) => {
            prev[curr.name] = curr;
            return prev;
        }, {});

    return data;
};
